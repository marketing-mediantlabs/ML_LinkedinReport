import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { SectionId, UploadValue, CompRow } from '../types';
import { MONTH_ABBR, monthLabel, currentMonthLabel } from './months';

export interface ParseResult {
  label: string;
  value: UploadValue;
  warnings: string[];
}

type Row = Record<string, string>;

/**
 * Reads a LinkedIn export. CSV goes through PapaParse; .xls/.xlsx go through
 * SheetJS, since several LinkedIn exports are genuinely Excel workbooks.
 * Multi-sheet workbooks are flattened: the sheet with the most rows wins.
 */
export async function readTabular(file: File): Promise<Row[]> {
  const isExcel = /\.(xlsx?|xlsm)$/i.test(file.name);
  if (isExcel) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    let best: Row[] = [];
    for (const name of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json<Row>(wb.Sheets[name], { defval: '', raw: false });
      if (rows.length > best.length) best = rows;
    }
    return best.map(lowerKeys);
  }
  const text = await file.text();
  const out = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });
  return (out.data || []).map(lowerKeys);
}

function lowerKeys(r: Row): Row {
  const o: Row = {};
  for (const k of Object.keys(r)) o[String(k).toLowerCase().trim()] = r[k];
  return o;
}

function findCol(headers: string[], patterns: RegExp[]): string | null {
  for (const p of patterns) {
    const hit = headers.find((h) => p.test(h));
    if (hit) return hit;
  }
  return null;
}

function num(v: unknown): number {
  if (v == null) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

function sum(rows: Row[], col: string | null): number {
  if (!col) return 0;
  return rows.reduce((acc, r) => acc + num(r[col]), 0);
}

/** Modal month across the date column. A file spanning two months picks the busier one. */
function detectMonth(rows: Row[], dateCol: string | null): string | null {
  if (!dateCol) return null;
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const d = new Date(r[dateCol]);
    if (!isNaN(d.getTime())) {
      const key = d.getFullYear() + '-' + d.getMonth();
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  const keys = Object.keys(counts);
  if (!keys.length) return null;
  keys.sort((a, b) => counts[b] - counts[a]);
  const [yr, mo] = keys[0].split('-').map(Number);
  return MONTH_ABBR[mo] + ' ' + String(yr).slice(2);
}

export async function parseUpload(section: SectionId, file: File): Promise<ParseResult> {
  const rows = await readTabular(file);
  if (!rows.length) throw new Error('No data rows found in that file.');

  const headers = Object.keys(rows[0]);
  const dateCol = findCol(headers, [/date/, /created/, /published/, /start/]);
  const label = detectMonth(rows, dateCol) || currentMonthLabel();
  const warnings: string[] = [];
  if (!dateCol) warnings.push('No date column found — filed under ' + label);

  const meta = {
    file: file.name,
    parsedAt: new Date().toISOString(),
    rowCount: rows.length,
  };

  let value: UploadValue;

  if (section === 'followers') {
    const org = findCol(headers, [/organic/]);
    const spon = findCol(headers, [/sponsor/]);
    const total = findCol(headers, [/total follower/, /new follower/]);
    let primary = 0;
    if (org || spon) primary = sum(rows, org) + sum(rows, spon);
    else if (total) primary = sum(rows, total);
    else warnings.push('Could not find organic/sponsored/total follower columns');
    value = { primary, secondary: sum(rows, org), meta };
  } else if (section === 'visitors') {
    const pv = findCol(headers, [/page view.*total/, /total.*page view/, /page views?$/, /page view/]);
    const uv = findCol(headers, [/unique/]);
    const pageViews = sum(rows, pv);
    if (!pv) warnings.push('Could not find page views column');
    let unique = sum(rows, uv);
    if (!uv) {
      unique = Math.round(pageViews * 0.37);
      warnings.push('Unique visitors estimated at 37% of page views');
    }
    value = { primary: pageViews, secondary: unique, meta };
  } else if (section === 'content') {
    const imp = findCol(headers, [/impression/]);
    const clk = findCol(headers, [/click/]);
    const react = findCol(headers, [/reaction/, /like/]);
    const com = findCol(headers, [/comment/]);
    if (!imp) warnings.push('Could not find impressions column');
    const engagement = sum(rows, clk) + sum(rows, react) + sum(rows, com);
    if (!clk && !react && !com) warnings.push('Could not find engagement columns');
    value = { primary: sum(rows, imp), secondary: engagement, posts: rows.length, meta };
  } else if (section === 'ads') {
    const spend = findCol(headers, [/amount spent/, /spend/, /cost/]);
    const imp = findCol(headers, [/impression/]);
    const clk = findCol(headers, [/click/]);
    if (!spend) warnings.push('Could not find spend column');
    value = { primary: sum(rows, spend), secondary: sum(rows, imp), clicks: sum(rows, clk), meta };
  } else {
    const nameCol = findCol(headers, [/company/, /page/, /name/]);
    const folCol = findCol(headers, [/new follower/, /follower/]);
    const postCol = findCol(headers, [/post/]);
    const comCol = findCol(headers, [/comment/]);
    const reactCol = findCol(headers, [/reaction/, /like/, /engagement/]);
    if (!nameCol || !folCol) warnings.push('Could not find company and/or follower columns');
    const list: CompRow[] = rows.map((r) => ({
      n: (nameCol ? r[nameCol] : '') || 'Unknown',
      f: num(folCol ? r[folCol] : 0),
      p: num(postCol ? r[postCol] : 0),
      c: num(comCol ? r[comCol] : 0),
      r: num(reactCol ? r[reactCol] : 0),
      highlight: /mediant/i.test((nameCol ? r[nameCol] : '') || ''),
    }));
    const mediant = list.find((x) => x.highlight);
    value = { primary: mediant ? mediant.f : 0, rows: list, meta };
  }

  return { label, value, warnings };
}

export { monthLabel };

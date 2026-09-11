import * as D from '../data/seedData';
import type { SectionId, Series, UploadStore } from '../types';
import { sortKey } from './months';

function num(v: string): number {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

/** Ad spend/impressions rolled up per month from the seeded ad-set rows. */
function adBaseline(): Series {
  const byMonth: Record<string, { spend: number; impr: number }> = {};
  for (const r of D.AD_SETS) {
    const m = r.period.match(/([A-Za-z]{3})[a-z]*\s+\d+.*?,\s*(\d{2})/);
    if (!m) continue;
    const lbl = m[1] + ' ' + m[2];
    if (!byMonth[lbl]) byMonth[lbl] = { spend: 0, impr: 0 };
    byMonth[lbl].spend += num(r.spend);
    byMonth[lbl].impr += num(r.impr);
  }
  const labels = Object.keys(byMonth).sort((a, b) => sortKey(a) - sortKey(b));
  return {
    labels,
    values: labels.map((l) => Math.round(byMonth[l].spend)),
    values2: labels.map((l) => byMonth[l].impr),
  };
}

function baseline(section: SectionId): Series {
  if (section === 'followers') return { labels: [...D.MONTHS], values: [...D.F_TOT], values2: null };
  if (section === 'visitors') return { labels: [...D.V_MONTHS], values: [...D.V_PV], values2: [...D.V_UV] };
  if (section === 'content') return { labels: [...D.C_MONTHS], values: [...D.C_IMP], values2: [...D.C_ENG] };
  if (section === 'ads') return adBaseline();
  return { labels: [], values: [], values2: null };
}

/**
 * Baseline history merged with uploads. Uploads win on a month collision;
 * new months are appended and the whole series is re-sorted chronologically.
 */
export function getSeries(section: SectionId, uploads: UploadStore): Series {
  const base = baseline(section);
  const labels = [...base.labels];
  const values = [...base.values];
  const values2 = base.values2 ? [...base.values2] : null;

  const up = uploads[section] || {};
  for (const lbl of Object.keys(up).sort((a, b) => sortKey(a) - sortKey(b))) {
    const v = up[lbl];
    const i = labels.indexOf(lbl);
    if (i >= 0) {
      values[i] = v.primary;
      if (values2 && v.secondary != null) values2[i] = v.secondary;
    } else {
      labels.push(lbl);
      values.push(v.primary || 0);
      if (values2) values2.push(v.secondary || 0);
    }
  }

  const order = labels.map((l, i) => i).sort((a, b) => sortKey(labels[a]) - sortKey(labels[b]));
  return {
    labels: order.map((i) => labels[i]),
    values: order.map((i) => values[i]),
    values2: values2 ? order.map((i) => values2[i]) : null,
  };
}

/** Every month present across all four domains, chronological. */
export function allMonths(uploads: UploadStore): string[] {
  const set: Record<string, true> = {};
  (['followers', 'visitors', 'content', 'ads'] as SectionId[]).forEach((s) => {
    getSeries(s, uploads).labels.forEach((l) => { set[l] = true; });
  });
  return Object.keys(set).sort((a, b) => sortKey(a) - sortKey(b));
}

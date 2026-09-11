import type { ChartConfiguration } from 'chart.js';
import * as D from '../data/seedData';
import type { Series } from '../types';
import { PAL, gridColor, tickColor, donutBorder } from '../theme';

/** Everything a config needs from the current theme. */
export interface Ctx { isDark: boolean }

function base(c: Ctx, tickFont = 10) {
  const g = gridColor(c.isDark);
  const t = tickColor(c.isDark);
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: g }, ticks: { color: t, font: { size: tickFont } } },
      y: { grid: { color: g }, ticks: { color: t } },
    },
  } as const;
}

function legendRight(c: Ctx, padding = 6) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: tickColor(c.isDark), boxWidth: 9, font: { size: 10 }, padding },
      },
    },
  };
}

function bar(labels: string[], data: number[], bg: string | string[], border: string | string[], c: Ctx, tickFont = 10): ChartConfiguration {
  return {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: bg, borderColor: border, borderWidth: 2, borderRadius: 6 }] },
    options: base(c, tickFont),
  } as ChartConfiguration;
}

function hbar(labels: string[], data: number[], bg: string | string[], border: string | string[], c: Ctx, max?: number): ChartConfiguration {
  const g = gridColor(c.isDark);
  const t = tickColor(c.isDark);
  return {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: bg, borderColor: border, borderWidth: 1.5, borderRadius: 4 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: g }, ticks: { color: t }, ...(max != null ? { max } : {}) },
        y: { grid: { color: g }, ticks: { color: t, font: { size: 9 } } },
      },
    },
  } as ChartConfiguration;
}

function combo(s: Series, barLabel: string, lineLabel: string, c: Ctx): ChartConfiguration {
  const g = gridColor(c.isDark);
  const t = tickColor(c.isDark);
  return {
    type: 'bar',
    data: {
      labels: s.labels,
      datasets: [
        { label: barLabel, data: s.values, backgroundColor: 'rgba(33,137,189,.7)', borderColor: '#2189bd', borderWidth: 1.5, borderRadius: 5, yAxisID: 'y' },
        { label: lineLabel, data: s.values2 || [], type: 'line' as const, borderColor: '#21a866', backgroundColor: 'rgba(33,168,102,.1)', borderWidth: 2, pointRadius: 3, tension: 0.4, fill: false, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: t, font: { size: 10 } } } },
      scales: {
        x: { grid: { color: g }, ticks: { color: t, font: { size: 10 } } },
        y: { grid: { color: g }, ticks: { color: t }, position: 'left' },
        y1: { grid: { drawOnChartArea: false }, ticks: { color: t }, position: 'right' },
      },
    },
  } as ChartConfiguration;
}

function donut(labels: string[], data: number[], c: Ctx, cutout: string): ChartConfiguration {
  return {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: PAL, borderWidth: 2, borderColor: donutBorder(c.isDark) }] },
    options: { ...legendRight(c), cutout },
  } as ChartConfiguration;
}

const MEDIA_BG = ['rgba(33,168,102,.8)', 'rgba(33,137,189,.8)', 'rgba(155,89,182,.8)', 'rgba(224,123,42,.8)'];
const MEDIA_BORDER = ['#21a866', '#2189bd', '#9b59b6', '#e07b2a'];

/* ---------------- Followers ---------------- */

export function monthlyFollowers(s: Series, c: Ctx): ChartConfiguration {
  const colors = s.labels.map((lbl, i) => {
    if (i === s.labels.length - 1) return 'rgba(224,123,42,.75)';
    return /2[6-9]$/.test(lbl) ? 'rgba(33,137,189,.75)' : 'rgba(33,168,102,.75)';
  });
  const borders = colors.map((x) => x.replace('.75', '1'));
  return bar(s.labels, s.values, colors, borders, c);
}
export const fSeniority = (c: Ctx) => donut(D.F_SEN_L, D.F_SEN_D, c, '58%');
export const fCsize = (c: Ctx) => donut(D.F_CS_L, D.F_CS_D, c, '58%');

/* ---------------- Visitors ---------------- */

export const vMonthly = (s: Series, c: Ctx) => combo(s, 'Page Views', 'Unique Visitors', c);
export const vIndustry = (c: Ctx) => hbar(D.V_IND_L, D.V_IND_D, 'rgba(33,137,189,.7)', '#2189bd', c);
export const vJob = (c: Ctx) => hbar(D.V_JOB_L, D.V_JOB_D, 'rgba(33,168,102,.7)', '#21a866', c);
export const vCsize = (c: Ctx) => bar(D.V_CS_L, D.V_CS_D, 'rgba(155,89,182,.7)', '#9b59b6', c, 9);

export function vSeniority(c: Ctx): ChartConfiguration {
  return {
    type: 'polarArea',
    data: { labels: D.V_SEN_L, datasets: [{ data: D.V_SEN_D, backgroundColor: PAL.map((x) => x + 'cc'), borderWidth: 1.5, borderColor: PAL }] },
    options: {
      ...legendRight(c, 5),
      scales: {
        r: {
          grid: { color: gridColor(c.isDark) },
          ticks: { color: tickColor(c.isDark), backdropColor: 'transparent', font: { size: 8 } },
        },
      },
    },
  } as ChartConfiguration;
}

/* ---------------- Content ---------------- */

export const cMonthly = (s: Series, c: Ctx) => combo(s, 'Impressions', 'Reactions+Clicks', c);
export const postsPerMonth = (c: Ctx) => bar(D.PC_MONTHS, D.PC_COUNT, 'rgba(33,168,102,.75)', '#21a866', c, 9);
export const mediaAvgImpr = (c: Ctx) => bar(D.MEDIA_L, D.MEDIA_AVG_IMPR, MEDIA_BG, MEDIA_BORDER, c);
export const cPostTypeEng = (c: Ctx) => hbar(D.C_POST_TYPE_L, D.C_POST_ENG_R, PAL, PAL, c, 16);
export const cPostTypeImp = (c: Ctx) => hbar(D.C_POST_TYPE_L, D.C_POST_IMP, PAL, PAL, c);

export function mediaEngRate(c: Ctx): ChartConfiguration {
  const cfg = bar(D.MEDIA_L, D.MEDIA_ENG_RATE, MEDIA_BG, MEDIA_BORDER, c);
  const opts = cfg.options as Record<string, unknown>;
  const scales = opts.scales as Record<string, Record<string, unknown>>;
  scales.y = { ...scales.y, max: 16 };
  return cfg;
}

export function mediaStacked(c: Ctx): ChartConfiguration {
  const g = gridColor(c.isDark);
  const t = tickColor(c.isDark);
  return {
    type: 'bar',
    data: {
      labels: D.STACK_MONTHS,
      datasets: [
        { label: 'Video', data: D.STACK_VIDEO, backgroundColor: 'rgba(33,168,102,.75)', borderRadius: 4 },
        { label: 'Image / Text', data: D.STACK_IMGTXT, backgroundColor: 'rgba(33,137,189,.75)', borderRadius: 4 },
        { label: 'Article', data: D.STACK_ARTICLE, backgroundColor: 'rgba(224,123,42,.75)', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: t, boxWidth: 9, font: { size: 10 } } } },
      scales: {
        x: { stacked: true, grid: { color: g }, ticks: { color: t, font: { size: 9 } } },
        y: { stacked: true, grid: { color: g }, ticks: { color: t } },
      },
    },
  } as ChartConfiguration;
}

export function mediaEfficiency(c: Ctx): ChartConfiguration {
  const g = gridColor(c.isDark);
  const t = tickColor(c.isDark);
  const faded = MEDIA_BG.map((x) => x.replace('.8', '.4'));
  return {
    type: 'bar',
    data: {
      labels: D.MEDIA_L,
      datasets: [
        { label: 'Post Count', data: D.MEDIA_COUNT, backgroundColor: faded, borderColor: MEDIA_BORDER, borderWidth: 1.5, borderRadius: 5, yAxisID: 'y' },
        { label: 'Total Impressions', data: D.MEDIA_TOTAL_IMPR, backgroundColor: MEDIA_BG, borderColor: MEDIA_BORDER, borderWidth: 2, borderRadius: 5, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: t, boxWidth: 9, font: { size: 10 } } } },
      scales: {
        x: { grid: { color: g }, ticks: { color: t } },
        y: { grid: { color: g }, ticks: { color: t }, position: 'left' },
        y1: { grid: { drawOnChartArea: false }, ticks: { color: t }, position: 'right' },
      },
    },
  } as ChartConfiguration;
}

/* ---------------- Ads ---------------- */

export function adSpend(c: Ctx): ChartConfiguration {
  return {
    type: 'doughnut',
    data: { labels: D.ADS_CAMP, datasets: [{ data: D.ADS_SPEND, backgroundColor: D.ADS_COLORS, borderColor: D.ADS_BORDER, borderWidth: 2 }] },
    options: { ...legendRight(c), cutout: '55%' },
  } as ChartConfiguration;
}
export const adImpr = (c: Ctx) => bar(D.ADS_CAMP, D.ADS_IMPR, D.ADS_COLORS, D.ADS_BORDER, c, 9);
export const adInd = (c: Ctx) => hbar(D.AD_IND_L, D.AD_IND_D, 'rgba(33,137,189,.7)', '#2189bd', c);
export const adJob = (c: Ctx) => hbar(D.AD_JOB_L, D.AD_JOB_D, 'rgba(33,168,102,.7)', '#21a866', c);
export const adSen = (c: Ctx) => donut(D.AD_SEN_L, D.AD_SEN_D, c, '55%');

export function adLoc(c: Ctx): ChartConfiguration {
  const bg = ['rgba(33,137,189,.9)', 'rgba(33,137,189,.7)', 'rgba(33,168,102,.8)', 'rgba(33,168,102,.6)', 'rgba(139,147,176,.5)'];
  return bar(D.AD_LOC_L, D.AD_LOC_D, bg, bg, c, 9);
}

export function hasqCTR(c: Ctx): ChartConfiguration {
  const bg = ['rgba(33,168,102,.6)', 'rgba(33,168,102,.8)', 'rgba(33,137,189,.6)', 'rgba(33,137,189,.9)'];
  const border = ['#21a866', '#21a866', '#2189bd', '#2189bd'];
  const cfg = bar(D.HASQ_CTR_L, D.HASQ_CTR_D, bg, border, c);
  const opts = cfg.options as Record<string, unknown>;
  const scales = opts.scales as Record<string, Record<string, unknown>>;
  scales.y = { ...scales.y, max: 0.55 };
  return cfg;
}

export function videoFunnel(c: Ctx): ChartConfiguration {
  const bg = ['rgba(155,89,182,.5)', 'rgba(155,89,182,.7)', 'rgba(33,168,102,.9)', 'rgba(33,168,102,.8)', 'rgba(33,168,102,.7)', 'rgba(33,168,102,.6)'];
  return bar(D.VIDEO_FUNNEL_L, D.VIDEO_FUNNEL_D, bg, bg, c, 9);
}

/* ---------------- Competitors ---------------- */

type CompEntry = (typeof D.COMP)[number];

function compChart(pick: (r: CompEntry) => number, c: Ctx): ChartConfiguration {
  const bg = D.COMP.map((r) => (r.highlight ? 'rgba(33,168,102,.8)' : 'rgba(33,137,189,.6)'));
  const border = D.COMP.map((r) => (r.highlight ? '#21a866' : '#2189bd'));
  return bar(D.COMP.map((r) => r.n), D.COMP.map(pick), bg, border, c, 9);
}
export const compFollowers = (c: Ctx) => compChart((r) => r.f, c);
export const compReactions = (c: Ctx) => compChart((r) => r.r, c);
export const compPosts = (c: Ctx) => compChart((r) => r.p, c);
export const compComments = (c: Ctx) => compChart((r) => r.c, c);

/* ---------------- Month-over-month ---------------- */

/** Bars, not lines — chosen for comparing discrete months. */
export function momBar(s: Series, c: Ctx): ChartConfiguration {
  return bar(s.labels, s.values, 'rgba(33,137,189,.75)', '#2189bd', c, 9);
}

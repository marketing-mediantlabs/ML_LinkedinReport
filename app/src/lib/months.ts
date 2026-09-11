export const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/** Turns 'May 26' into a sortable integer. Tolerates a trailing '*'. */
export function sortKey(label: string): number {
  if (!label) return 0;
  const parts = String(label).replace('*', '').trim().split(' ');
  const mi = MONTH_ABBR.indexOf(parts[0]);
  const yr = parseInt(parts[1], 10) || 0;
  return yr * 12 + (mi < 0 ? 0 : mi);
}

export function monthLabel(d: Date): string {
  return MONTH_ABBR[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
}

export function currentMonthLabel(): string {
  return monthLabel(new Date());
}

export function sortLabels(labels: string[]): string[] {
  return [...labels].sort((a, b) => sortKey(a) - sortKey(b));
}

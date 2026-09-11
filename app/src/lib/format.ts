export function int(n: number): string {
  return Math.round(n).toLocaleString();
}
export function usd(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}
export function pct(n: number, dp = 1): string {
  return n.toFixed(dp) + '%';
}
export function ratio(a: number, b: number, dp = 1): string {
  return (a / Math.max(b, 1)).toFixed(dp);
}

export interface Delta {
  text: string;
  direction: 'up' | 'down' | 'none';
}

/** Month-over-month change. Guards divide-by-zero and a missing prior month. */
export function delta(value: number, prior: number | null, short = false): Delta {
  if (prior == null || prior === 0) {
    return { text: short ? '—' : 'No prior month to compare', direction: 'none' };
  }
  const change = ((value - prior) / prior) * 100;
  const up = change >= 0;
  const arrow = up ? '↑ ' : '↓ ';
  const body = arrow + Math.abs(change).toFixed(1) + '%';
  return {
    text: short ? body : body + ' vs prior month',
    direction: up ? 'up' : 'down',
  };
}

export function deltaClass(d: Delta): string {
  if (d.direction === 'up') return 'delta delta--up';
  if (d.direction === 'down') return 'delta delta--down';
  return 'delta delta--none';
}

import type { Series } from '../types';
import { delta, deltaClass } from '../lib/format';

export interface SnapshotSpec {
  label: string;
  value: number;
  prior: number | null;
  format: (n: number) => string;
}

/** Pulls one month (and its predecessor) out of a series. */
export function pick(s: Series, month: string, useSecondary = false): { value: number; prior: number | null } | null {
  const i = s.labels.indexOf(month);
  if (i < 0) return null;
  const arr = useSecondary ? s.values2 : s.values;
  if (!arr) return null;
  return { value: arr[i], prior: i > 0 ? arr[i - 1] : null };
}

export function SnapshotGrid({ items }: { items: SnapshotSpec[] }) {
  if (!items.length) {
    return (
      <div className="card" style={{ marginBottom: 24 }}>
        <h3>No data for the selected month</h3>
        <p className="card__cap" style={{ margin: 0 }}>
          Pick another month, or upload that month&rsquo;s export below.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid--snapshot">
      {items.map((s) => {
        const d = delta(s.value, s.prior);
        return (
          <div className="kpi" key={s.label}>
            <div className="kpi__label">{s.label}</div>
            <div className="kpi__value kpi__value--sm">{s.format(s.value)}</div>
            <div className={deltaClass(d)}>{d.text}</div>
          </div>
        );
      })}
    </div>
  );
}

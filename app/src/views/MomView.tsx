import { useMemo, useState } from 'react';
import * as CFG from '../charts/configs';
import { getSeries } from '../lib/series';
import { int, usd, delta, deltaClass } from '../lib/format';
import type { Series, SectionId } from '../types';
import { PageHead, Rule, ChartCard } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard } from '../components/Tables';
import type { ViewCtx } from './context';

interface SectionSpec {
  section: SectionId;
  rule: string;
  metric: string;
  format: (n: number) => string;
}

const SECTIONS: SectionSpec[] = [
  { section: 'followers', rule: 'Followers — New Followers per Month', metric: 'New Followers', format: int },
  { section: 'visitors', rule: 'Visitors — Page Views per Month', metric: 'Page Views', format: int },
  { section: 'content', rule: 'Content — Impressions per Month', metric: 'Impressions', format: int },
  { section: 'ads', rule: 'Ads — Spend per Month', metric: 'Spend', format: usd },
];

function MomSection({ spec, series, isDark }: { spec: SectionSpec; series: Series; isDark: boolean }) {
  const config = useMemo(() => CFG.momBar(series, { isDark }), [series, isDark]);
  // Newest month first in the table; the chart stays chronological.
  const rows = series.labels.map((label, i) => {
    const value = series.values[i];
    const d = delta(value, i > 0 ? series.values[i - 1] : null, true);
    return { label, value: spec.format(value), d };
  }).reverse();

  const [monthA, setMonthA] = useState<string>('');
  const [monthB, setMonthB] = useState<string>('');
  const compMonthA = monthA || (series.labels.length > 1 ? series.labels[series.labels.length - 2] : series.labels[0]) || '';
  const compMonthB = monthB || series.labels[series.labels.length - 1] || '';
  const idxA = series.labels.indexOf(compMonthA);
  const idxB = series.labels.indexOf(compMonthB);
  const valA = idxA >= 0 ? series.values[idxA] : null;
  const valB = idxB >= 0 ? series.values[idxB] : null;
  const diff = valA != null && valB != null ? valB - valA : null;
  const pctChange = diff != null && valA ? (diff / valA) * 100 : null;
  const compUp = pctChange != null && pctChange >= 0;

  return (
    <div className="mom-section">
      <Rule>{spec.rule}</Rule>
      <div className="grid grid--compare">
        <div className="kpi">
          <div className="kpi__label">Compare from</div>
          <select className="control" style={{ width: '100%' }} value={compMonthA} onChange={(e) => setMonthA(e.target.value)}>
            {series.labels.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="kpi">
          <div className="kpi__label">Compare to</div>
          <select className="control" style={{ width: '100%' }} value={compMonthB} onChange={(e) => setMonthB(e.target.value)}>
            {series.labels.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="kpi">
          <div className="kpi__label">Result</div>
          <div className="kpi__value">{diff == null ? '—' : (diff >= 0 ? '+' : '-') + spec.format(Math.abs(diff))}</div>
          <div className={'delta ' + (pctChange == null ? 'delta--none' : compUp ? 'delta--up' : 'delta--down')}>
            {pctChange == null ? 'No % change available' : (compUp ? '↑ ' : '↓ ') + Math.abs(pctChange).toFixed(1) + '%'}
          </div>
          <div className="kpi__sub">{valA == null ? '—' : spec.format(valA)} → {valB == null ? '—' : spec.format(valB)}</div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <ChartCard title={spec.metric + ' by month'} caption="Bars compare discrete months · uploads merge into this series automatically">
          <ChartCanvas config={config} height="sm" summary={spec.metric + ' per month from ' + series.labels[0] + ' to ' + series.labels[series.labels.length - 1] + '.'} />
        </ChartCard>
      </div>
      <TableCard title={spec.metric + ' — month over month'} caption="Newest month first · change calculated against the prior month">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">{spec.metric}</th>
            <th scope="col">vs Prior Month</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td className="td--strong">{r.value}</td>
              <td className={deltaClass(r.d)} style={{ marginTop: 0 }}>{r.d.text}</td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

export function MomView(ctx: ViewCtx) {
  const series = useMemo(
    () => SECTIONS.map((s) => getSeries(s.section, ctx.uploads)),
    [ctx.uploads],
  );

  return (
    <div data-screen-label="Month-over-Month">
      <PageHead
        title="Month-over-Month Trends"
        subtitle="Every tracked metric by month, with automatic change against the prior month"
        chip="Baseline history plus every month you have uploaded"
      />
      {SECTIONS.map((spec, i) => (
        <MomSection key={spec.section} spec={spec} series={series[i]} isDark={ctx.isDark} />
      ))}
    </div>
  );
}

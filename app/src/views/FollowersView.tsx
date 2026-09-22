import { useMemo, useState } from 'react';
import * as D from '../data/seedData';
import * as CFG from '../charts/configs';
import { getSeries } from '../lib/series';
import { int, delta, deltaClass } from '../lib/format';
import { PageHead, Rule, ChartCard, KpiGrid, type Kpi } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard, Rank, BarCell, EmptyRow } from '../components/Tables';
import { UploadZone, FilterBox } from '../components/Tools';
import { SnapshotGrid, pick, type SnapshotSpec } from './Snapshot';
import { match, type ViewCtx } from './context';

const KPIS: Kpi[] = [
  { label: '🏠 Total Page Followers', value: '3,144', sub: 'Live count · LinkedIn page today', badge: 'As of Jul 8, 2026', grad: 'def', variant: 'g', valueColor: 'var(--green)' },
  { label: 'New Followers (Tracked)', value: '2,948', sub: 'Apr 1, 2025 → Jul 8, 2026', badge: '464 days', grad: 'def', variant: 'g' },
  { label: 'Organic', value: '2,859', sub: '97.0% of all growth', badge: '↑ 97.0%', grad: 'def', variant: 'g' },
  { label: 'Auto-Invited', value: '89', sub: '3.0% of total', badge: '3.0%', grad: 'b', variant: 'b' },
  { label: 'Pre-tracking Base', value: '207', sub: 'Followers before Apr 1, 2025', badge: 'Historical', grad: 'o', variant: 'b' },
  { label: 'Sponsored', value: '0', sub: 'No paid campaigns yet', badge: 'Opportunity', grad: 'o', variant: 'b' },
  { label: 'Peak Day', value: '218', sub: 'Jun 29, 2026', badge: 'All-time high', grad: 'def', variant: 'g' },
  { label: 'Best Month', value: '510', sub: 'Jun 2026', badge: 'Monthly record', grad: 'b', variant: 'b' },
  { label: 'Monthly Avg', value: '187', sub: 'Across 15 months', badge: 'Avg', grad: 'p', variant: 'b' },
];

export function FollowersView(ctx: ViewCtx) {
  const series = useMemo(() => getSeries('followers', ctx.uploads), [ctx.uploads]);
  const chart = useMemo(() => CFG.monthlyFollowers(series, ctx), [series, ctx.isDark]);
  const senChart = useMemo(() => CFG.fSeniority(ctx), [ctx.isDark]);
  const csChart = useMemo(() => CFG.fCsize(ctx), [ctx.isDark]);

  const term = ctx.filters.followers;
  const rows = D.F_LOC.map((r, i) => ({ ...r, i })).filter((r) => match(term, [r.l]));

  const snap: SnapshotSpec[] = [];
  const p = pick(series, ctx.selectedMonth);
  if (p) snap.push({ label: 'New Followers — ' + ctx.selectedMonth, value: p.value, prior: p.prior, format: int });

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
    <div data-screen-label="Followers">
      <PageHead
        title="Follower Growth Report"
        subtitle="Full organic growth analysis · Apr 1, 2025 – Jul 8, 2026, plus your monthly uploads"
        chip="Live total: 3,144 · Starting base: 207"
      />

      <div className="grid grid--tools">
        <UploadZone section="followers" label="📤 Upload this month's Followers export" status={ctx.status.followers} onUpload={ctx.onUpload} />
        <FilterBox id="filter-followers" label="🔎 Filter locations" placeholder="e.g. Chennai" value={term} onChange={(v) => ctx.setFilter('followers', v)} />
      </div>

      {ctx.viewMode === 'month'
        ? <SnapshotGrid items={snap} />
        : <KpiGrid items={KPIS} />}

      <Rule>Monthly Growth — Full Timeline</Rule>
      <div style={{ marginBottom: 20 }}>
        <ChartCard title="Monthly New Followers" caption="Green = 2025 · Blue = 2026 · Orange = latest partial month · Uploads merge in automatically">
          <ChartCanvas config={chart} height="lg" summary={'Monthly new followers from ' + series.labels[0] + ' to ' + series.labels[series.labels.length - 1] + ', peaking at ' + int(Math.max(...series.values)) + '.'} />
        </ChartCard>
      </div>

      <Rule>Month-over-Month Comparison</Rule>
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
          <div className="kpi__value">{diff == null ? '—' : (diff >= 0 ? '+' : '') + int(diff)}</div>
          <div className={'delta ' + (pctChange == null ? 'delta--none' : compUp ? 'delta--up' : 'delta--down')}>
            {pctChange == null ? 'No % change available' : (compUp ? '↑ ' : '↓ ') + Math.abs(pctChange).toFixed(1) + '%'}
          </div>
          <div className="kpi__sub">{valA == null ? '—' : int(valA)} → {valB == null ? '—' : int(valB)}</div>
        </div>
      </div>

      <TableCard title="New Followers — month over month" caption="Newest month first · change calculated against the prior month">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">New Followers</th>
            <th scope="col">vs Prior Month</th>
          </tr>
        </thead>
        <tbody>
          {series.labels.map((label, i) => {
            const value = series.values[i];
            const d = delta(value, i > 0 ? series.values[i - 1] : null, true);
            return (
              <tr key={label}>
                <td>{label}</td>
                <td className="td--strong">{int(value)}</td>
                <td className={deltaClass(d)} style={{ marginTop: 0 }}>{d.text}</td>
              </tr>
            );
          }).reverse()}
        </tbody>
      </TableCard>

      <Rule>Follower Audience Profile</Rule>
      <div className="grid grid--charts">
        <ChartCard title="Seniority Distribution" caption="Senior + Entry dominate at 82% · Decision-makers (Mgr+Dir+VP+CXO) = 17.3%">
          <ChartCanvas config={senChart} summary="Follower seniority: Senior 802, Entry 791, Manager 106, Director 103, then smaller tiers." />
        </ChartCard>
        <ChartCard title="Company Size" caption="Enterprise (10,001+) = 25.4% · Strong mid-market presence">
          <ChartCanvas config={csChart} summary="Follower company size: 10,001+ leads at 457, then 51-200 at 335 and 1,001-5K at 277." />
        </ChartCard>
      </div>

      <Rule>Top Follower Locations</Rule>
      <TableCard title="Follower Geography — Top 15" caption="46% Chennai · Near-100% India · US/Canada Follower Ads needed for HASQ targeting">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Location</th><th scope="col">Followers</th>
            <th scope="col">Share</th><th scope="col">Distribution</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? <EmptyRow cols={5} term={term} /> : rows.map((r) => (
            <tr key={r.l}>
              <td><Rank i={r.i} isDark={ctx.isDark} /></td>
              <td>{r.l}</td>
              <td className="td--strong">{int(r.v)}</td>
              <td>{r.p}%</td>
              <td><BarCell pct={r.p} scale={1.8} tone="g" /></td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

import { useMemo } from 'react';
import * as D from '../data/seedData';
import * as CFG from '../charts/configs';
import { getSeries } from '../lib/series';
import { int } from '../lib/format';
import { PageHead, Rule, ChartCard, KpiGrid, type Kpi } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard, Rank, BarCell, EmptyRow } from '../components/Tables';
import { UploadZone, FilterBox } from '../components/Tools';
import { SnapshotGrid, pick, type SnapshotSpec } from './Snapshot';
import { match, type ViewCtx } from './context';

const KPIS: Kpi[] = [
  { label: 'Total Page Views', value: '11,090', sub: 'Jul 2025 – Jul 2026', badge: 'Full year', grad: 'def', variant: 'g' },
  { label: 'Unique Visitors', value: '4,102', sub: '37% unique visit rate', badge: 'Unique', grad: 'b', variant: 'b' },
  { label: 'Best Month PV', value: '1,404', sub: 'April 2026', badge: 'Peak month', grad: 'def', variant: 'g' },
  { label: 'Best Month UV', value: '472', sub: 'April 2026', badge: 'Peak visitors', grad: 'b', variant: 'b' },
  { label: 'Avg PV / Month', value: '853', sub: 'Across 13 months', badge: 'Monthly avg', grad: 'o', variant: 'b' },
  { label: 'Avg UV / Month', value: '316', sub: 'Monthly unique visitors', badge: 'Monthly avg', grad: 'p', variant: 'b' },
];

export function VisitorsView(ctx: ViewCtx) {
  const series = useMemo(() => getSeries('visitors', ctx.uploads), [ctx.uploads]);
  const monthly = useMemo(() => CFG.vMonthly(series, ctx), [series, ctx.isDark]);
  const ind = useMemo(() => CFG.vIndustry(ctx), [ctx.isDark]);
  const job = useMemo(() => CFG.vJob(ctx), [ctx.isDark]);
  const sen = useMemo(() => CFG.vSeniority(ctx), [ctx.isDark]);
  const cs = useMemo(() => CFG.vCsize(ctx), [ctx.isDark]);

  const term = ctx.filters.visitors;
  const rows = D.V_LOC.map((r, i) => ({ ...r, i })).filter((r) => match(term, [r.l]));

  const snap: SnapshotSpec[] = [];
  const pv = pick(series, ctx.selectedMonth);
  const uv = pick(series, ctx.selectedMonth, true);
  if (pv) snap.push({ label: 'Page Views — ' + ctx.selectedMonth, value: pv.value, prior: pv.prior, format: int });
  if (uv) snap.push({ label: 'Unique Visitors — ' + ctx.selectedMonth, value: uv.value, prior: uv.prior, format: int });

  return (
    <div data-screen-label="Visitors">
      <PageHead
        title="Page Visitor Report"
        subtitle="LinkedIn company page visits · Jul 9, 2025 – Jul 8, 2026"
        chip="365 days · All page views combined"
      />

      <div className="grid grid--tools">
        <UploadZone section="visitors" label="📤 Upload this month's Visitors export" status={ctx.status.visitors} onUpload={ctx.onUpload} />
        <FilterBox id="filter-visitors" label="🔎 Filter locations" placeholder="e.g. Austin" value={term} onChange={(v) => ctx.setFilter('visitors', v)} />
      </div>

      {ctx.viewMode === 'month' ? <SnapshotGrid items={snap} /> : <KpiGrid items={KPIS} />}

      <Rule>Monthly Visitor Trend</Rule>
      <div style={{ marginBottom: 20 }}>
        <ChartCard title="Monthly Page Views & Unique Visitors" caption="Page views (bars) vs unique visitors (line) · Strong correlation with content activity">
          <ChartCanvas config={monthly} height="lg" summary="Monthly page views and unique visitors, peaking in April 2026 at 1,404 views and 472 unique visitors." />
        </ChartCard>
      </div>

      <Rule>Visitor Audience Profile</Rule>
      <div className="grid grid--charts">
        <ChartCard title="Top Industries (Visitor Views)" caption="IT Services dominates · HASQ target verticals underrepresented">
          <ChartCanvas config={ind} summary="Visitor industries led by IT Services at 4,962 views and E-Learning Providers at 3,329." />
        </ChartCard>
        <ChartCard title="Top Job Functions (Visitor Views)" caption="Arts & Design and Education lead — opportunity to shift toward L&D / HR buyers">
          <ChartCanvas config={job} summary="Visitor job functions led by Arts and Design at 2,340 and Education at 2,009." />
        </ChartCard>
        <ChartCard title="Visitor Seniority" caption="Senior + Entry = 79% · Manager+Director+VP+CXO = 14% decision-maker layer">
          <ChartCanvas config={sen} height="sm" summary="Visitor seniority dominated by Senior at 5,785 and Entry at 5,659." />
        </ChartCard>
        <ChartCard title="Visitor Company Size" caption="SMB (51–200) leads visits · Enterprise (10K+) = 20% strong">
          <ChartCanvas config={cs} height="sm" summary="Visitor company size led by 51-200 at 3,158 and 10,001+ at 2,796." />
        </ChartCard>
      </div>

      <Rule>Top Visitor Locations</Rule>
      <TableCard title="Visitor Geography — Top 15" caption="Chennai dominates visits too · Austin, TX is the first US metro appearance — positive signal for North America">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Location</th><th scope="col">Views</th>
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
              <td><BarCell pct={r.p} scale={1.2} tone="b" /></td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

import { useMemo } from 'react';
import * as D from '../data/seedData';
import * as CFG from '../charts/configs';
import { getSeries } from '../lib/series';
import { int, usd } from '../lib/format';
import { GREEN, BLUE, PURPLE, ORANGE } from '../theme';
import { PageHead, Rule, ChartCard, KpiGrid, InsightPanel, Insight, Recommendation, type Kpi } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard, Rank, BarCell, EmptyRow } from '../components/Tables';
import { UploadZone, FilterBox } from '../components/Tools';
import { SnapshotGrid, pick, type SnapshotSpec } from './Snapshot';
import { match, type ViewCtx } from './context';

const KPIS: Kpi[] = [
  { label: 'Total Ad Spend', value: '$1,649', sub: 'Across 5 campaigns', badge: 'USD', grad: 'def', variant: 'g' },
  { label: 'Total Impressions', value: '104K', sub: '104,786 total', badge: 'Impressions', grad: 'b', variant: 'b' },
  { label: 'Total Clicks', value: '78', sub: 'Across all campaigns', badge: 'Clicks', grad: 'def', variant: 'g' },
  { label: 'Overall CTR', value: '0.07%', sub: 'Industry avg ~0.4%', badge: 'CTR', grad: 'o', variant: 'b' },
  { label: 'Avg CPM', value: '$14.31', sub: 'Cost per 1K impressions', badge: 'CPM', grad: 'p', variant: 'b' },
  { label: 'Video Views', value: '64,967', sub: 'Boost video campaign', badge: 'Views', grad: 'def', variant: 'g' },
  { label: 'HASQ Clicks', value: '69', sub: 'TOF + MOF combined', badge: 'HASQ', grad: 'b', variant: 'b' },
  { label: 'Avg CPC (HASQ)', value: '$17.38', sub: 'TOF+MOF website visits', badge: 'CPC', grad: 'r', variant: 'b' },
];

interface Campaign {
  icon: string; title: string; period: string; status: string; accent: string; note: string;
  primary: { l: string; v: string }[];
  secondary: { l: string; v: string }[];
}

const CAMPAIGNS: Campaign[] = [
  { icon: '🔬', title: 'Pilot Campaign', period: 'Oct 20–24, 2025 · Video Views · CPM', status: 'PAUSED', accent: '#8b93b0',
    primary: [{ l: 'Spend', v: '$100' }, { l: 'Impressions', v: '11.3K' }, { l: 'Vid Views', v: '7,472' }],
    secondary: [{ l: 'Budget', v: '$100' }, { l: 'CPM', v: '$8.81' }, { l: 'View Rate', v: '65.8%' }],
    note: 'Audience Network campaign. Strong video view rate (65.8%) — a good content resonance test.' },
  { icon: '📢', title: 'ML_Boost — Video Post', period: 'Mar 30–Apr 3, 2026 · Brand Awareness', status: 'PAUSED', accent: PURPLE,
    primary: [{ l: 'Spend', v: '$150' }, { l: 'Impressions', v: '79.4K' }, { l: 'Vid Views', v: '64.9K' }],
    secondary: [{ l: 'Budget', v: '$150' }, { l: 'CPM', v: '$1.88' }, { l: 'View Rate', v: '81.8%' }],
    note: 'Best CPM ($1.88) via Audience Network reach. 81.8% video view rate. Brand awareness at scale.' },
  { icon: '🎯', title: 'ML-HASQ-TOF', period: 'Apr 24–30, 2026 · Website Visits', status: 'PAUSED', accent: GREEN,
    primary: [{ l: 'Spend', v: '$500' }, { l: 'Impressions', v: '7,344' }, { l: 'Clicks', v: '21' }],
    secondary: [{ l: 'Budget', v: '$500' }, { l: 'CTR', v: '0.286%' }, { l: 'CPC', v: '$23.81' }],
    note: 'HASQ awareness targeting. Set 02 marginally outperformed Set 01. Two ad sets, both LinkedIn feed.' },
  { icon: '🎯', title: 'ML-HASQ-MOF', period: 'May 1–8, 2026 · Website Visits', status: 'PAUSED', accent: BLUE,
    primary: [{ l: 'Spend', v: '$700' }, { l: 'Impressions', v: '12,270' }, { l: 'Clicks', v: '48' }],
    secondary: [{ l: 'Budget', v: '$700' }, { l: 'CTR', v: '0.391%' }, { l: 'CPC', v: '$14.58' }],
    note: 'Best CTR (0.391%) across HASQ campaigns. Set 02 dominated at $527 spend, 41 clicks, 0.428% CTR.' },
];

export function AdsView(ctx: ViewCtx) {
  const series = useMemo(() => getSeries('ads', ctx.uploads), [ctx.uploads]);
  const spend = useMemo(() => CFG.adSpend(ctx), [ctx.isDark]);
  const impr = useMemo(() => CFG.adImpr(ctx), [ctx.isDark]);
  const ctr = useMemo(() => CFG.hasqCTR(ctx), [ctx.isDark]);
  const funnel = useMemo(() => CFG.videoFunnel(ctx), [ctx.isDark]);
  const ind = useMemo(() => CFG.adInd(ctx), [ctx.isDark]);
  const job = useMemo(() => CFG.adJob(ctx), [ctx.isDark]);
  const sen = useMemo(() => CFG.adSen(ctx), [ctx.isDark]);
  const loc = useMemo(() => CFG.adLoc(ctx), [ctx.isDark]);

  const term = ctx.filters.ads;
  const sets = D.AD_SETS.map((r, i) => ({ ...r, i })).filter((r) => match(term, [r.camp, r.set, r.obj]));

  const snap: SnapshotSpec[] = [];
  const sp = pick(series, ctx.selectedMonth);
  const im = pick(series, ctx.selectedMonth, true);
  if (sp) snap.push({ label: 'Ad Spend — ' + ctx.selectedMonth, value: sp.value, prior: sp.prior, format: usd });
  if (im) snap.push({ label: 'Ad Impressions — ' + ctx.selectedMonth, value: im.value, prior: im.prior, format: int });

  return (
    <div data-screen-label="Ad Campaigns">
      <PageHead
        title="LinkedIn Ad Campaign Performance"
        subtitle="Account: Mediant Labs Inc. — Primary · Account ID: 516781033"
        chip="Oct 16, 2025 – Jul 8, 2026 · Total invested: $1,649.50 · 5 campaigns"
      />

      <div className="grid grid--tools">
        <UploadZone section="ads" label="📤 Upload this month's Campaign Manager export" status={ctx.status.ads} onUpload={ctx.onUpload} />
        <FilterBox id="filter-ads" label="🔎 Filter campaigns and ad sets" placeholder="e.g. HASQ, MOF" value={term} onChange={(v) => ctx.setFilter('ads', v)} />
      </div>

      {ctx.viewMode === 'month' ? <SnapshotGrid items={snap} /> : <KpiGrid items={KPIS} tight />}

      <Rule>Campaign Performance Breakdown</Rule>
      <div className="grid grid--campaigns">
        {CAMPAIGNS.map((a) => (
          <div className="campaign" key={a.title} style={{ borderLeft: '4px solid ' + a.accent }}>
            <div className="campaign__head">
              <div>
                <div className="campaign__title"><span aria-hidden="true">{a.icon}</span> {a.title}</div>
                <div className="campaign__period">{a.period}</div>
              </div>
              <span className="campaign__status" style={{ background: a.accent + '26', color: a.accent, border: '1px solid ' + a.accent }}>{a.status}</span>
            </div>
            <div className="metricgrid metricgrid--3" style={{ marginBottom: 10 }}>
              {a.primary.map((m) => (
                <div className="metric metric--center" key={m.l}>
                  <div className="metric__l">{m.l}</div>
                  <div className="metric__v metric__v--md" style={{ color: a.accent }}>{m.v}</div>
                </div>
              ))}
            </div>
            <div className="metricgrid metricgrid--3">
              {a.secondary.map((m) => (
                <div className="metric metric--center" key={m.l}>
                  <div className="metric__l">{m.l}</div>
                  <div className="metric__v metric__v--sm">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="campaign__note">{a.note}</div>
          </div>
        ))}
      </div>

      <Rule>Spend &amp; Impressions Comparison</Rule>
      <div className="grid grid--charts">
        <ChartCard title="Budget Allocation by Campaign" caption="HASQ campaigns account for roughly 80% of total spend">
          <ChartCanvas config={spend} height="sm" summary="Ad spend by campaign: HASQ MOF $700, HASQ TOF $500, ML Boost Video $150, Boost May $150, Pilot $100." />
        </ChartCard>
        <ChartCard title="Impressions by Campaign" caption="ML Boost Video dominates volume (79K) at a very low CPM ($1.88) via Audience Network">
          <ChartCanvas config={impr} height="sm" summary="Impressions by campaign: ML Boost Video 79,406, HASQ MOF 12,270, Pilot 11,349, HASQ TOF 7,344, Boost May 5,766." />
        </ChartCard>
      </div>

      <Rule>Ad Set Level Performance</Rule>
      <TableCard title="All Ad Sets — Detailed Metrics" caption="Oct 2025 – Jul 2026 · LinkedIn Campaign Manager data" width="xwide">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Campaign</th><th scope="col">Ad Set</th><th scope="col">Objective</th>
            <th scope="col">Period</th><th scope="col">Spend</th><th scope="col">Impressions</th>
            <th scope="col">Clicks</th><th scope="col">CTR</th><th scope="col">CPM</th><th scope="col">CPC</th>
          </tr>
        </thead>
        <tbody>
          {sets.length === 0 ? <EmptyRow cols={11} term={term} /> : sets.map((r) => (
            <tr key={r.camp + r.set}>
              <td><Rank i={r.i} isDark={ctx.isDark} /></td>
              <td>{r.camp}</td>
              <td>{r.set}</td>
              <td>{r.obj}</td>
              <td>{r.period}</td>
              <td>{r.spend}</td>
              <td className="td--strong" style={r.bigImpr ? { color: PURPLE } : undefined}>{r.impr}</td>
              <td>{r.clicks}</td>
              <td className="td--strong" style={r.top ? { color: GREEN } : undefined}>{r.ctr}</td>
              <td className="td--strong" style={r.bestCpm ? { color: GREEN } : undefined}>{r.cpm}</td>
              <td>{r.cpc}</td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      <Rule>HASQ Funnel Performance &amp; Video Retention</Rule>
      <div className="grid grid--charts">
        <ChartCard title="HASQ CTR by Ad Set" caption="MOF Set 02 best at 0.428% · All HASQ sets near or above the LinkedIn average of 0.3%">
          <ChartCanvas config={ctr} height="sm" summary="HASQ click-through rate by ad set: MOF Set 02 0.428%, TOF Set 02 0.287%, TOF Set 01 0.285%, MOF Set 01 0.259%." />
        </ChartCard>
        <ChartCard title="Video Retention Funnel — ML Boost Video" caption="79,406 impressions → 64,967 plays → retention at each quartile">
          <ChartCanvas config={funnel} height="sm" summary="Video funnel: 79,406 impressions, 64,967 plays, 20,499 at 25%, 16,869 at 50%, 12,735 at 75% and completion." />
        </ChartCard>
      </div>

      <Rule>Ad Audience Demographics</Rule>
      <div className="grid grid--charts">
        <ChartCard title="Top Industries Reached" caption="Tech & Internet (22.7%) plus IT Services (16.2%) — strong enterprise reach">
          <ChartCanvas config={ind} summary="Industries reached led by Tech and Internet at 48,369 impressions and IT Services at 34,473." />
        </ChartCard>
        <ChartCard title="Top Job Functions Reached" caption="Engineering, Business Dev and IT are the top three">
          <ChartCanvas config={job} summary="Job functions reached led by Engineering at 23,858, Business Development at 22,873 and IT at 22,748." />
        </ChartCard>
        <ChartCard title="Seniority Distribution" caption="Senior, Director and Manager together make up roughly 45% of impressions">
          <ChartCanvas config={sen} height="sm" summary="Seniority reached: Senior 53,152, Director 17,674, Manager 15,591, Owner 9,382, VP 8,854, CXO 7,525." />
        </ChartCard>
        <ChartCard title="Top Locations" caption="US (36.9%) plus Canada (12.8%) — validates the HASQ geo-targeting">
          <ChartCanvas config={loc} height="sm" summary="Locations reached: United States 86,098, Canada 29,833, Greater Toronto 9,343, New York City 7,293." />
        </ChartCard>
      </div>

      <Rule>Top Job Titles Reached</Rule>
      <TableCard title="Decision-Maker Titles in Ad Audience" caption="C-suite and owner-level titles dominate impressions — strong alignment with the HASQ buyer persona">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Job Title</th><th scope="col">Share</th><th scope="col">Distribution</th>
          </tr>
        </thead>
        <tbody>
          {D.AD_TITLES.map((r, i) => (
            <tr key={r.t}>
              <td><Rank i={i} isDark={ctx.isDark} /></td>
              <td>{r.t}</td>
              <td>{r.pct}%</td>
              <td><BarCell pct={r.pct} scale={1.5} tone="g" /></td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      <Rule>Campaign Insights &amp; Recommendations</Rule>
      <div className="grid grid--charts">
        <InsightPanel title="What's Working">
          <Insight eyebrow="📈 MOF outperforms TOF" body="HASQ-MOF-May (0.391% CTR, $14.58 CPC) beat TOF-April (0.286%, $23.81 CPC). Retargeting warm audiences is more efficient — prioritise MOF budget in the next cycle." />
          <Insight eyebrow="🎬 Video reach at ultra-low CPM" body="ML Boost Video delivered 79K impressions at just $1.88 CPM via Audience Network. An 81.8% video view rate signals strong content quality. Use for brand awareness at scale before HASQ lead campaigns." />
          <Insight eyebrow="🌍 North America audience confirmed" body="US (36.9%) plus Canada (12.8%) equals 49.7% of ad impressions, confirming the HASQ geo-targeting is working. Greater Toronto alone drove 19 clicks — the highest single-city engagement." />
          <Insight eyebrow="👔 C-Suite is in your audience" body="Owner, Founder, President and CEO are the top four job titles reached. Senior-level targeting is working — these are HASQ's ideal buyers." />
        </InsightPanel>
        <InsightPanel title="Optimisation Recommendations">
          <Recommendation accent={GREEN} title="💰 Budget: shift to MOF-heavy (60/40)" body="MOF delivers 37% lower CPC than TOF. For the next $1,500, allocate $900 to MOF retargeting and $600 to TOF awareness." />
          <Recommendation accent={BLUE} title="🎯 Add Lead Gen forms to HASQ campaigns" body="Current campaigns drive clicks to the website but track zero leads in the report. Adding LinkedIn Lead Gen forms directly to HASQ ads would capture contacts without a landing page dependency." />
          <Recommendation accent={PURPLE} title="📢 Run Follower Ads alongside HASQ" body="Follower Ads targeting US and Canada professionals in Engineering, L&D and Operations would compound HASQ brand awareness while growing the page internationally." />
          <Recommendation accent={ORANGE} title="🔁 Test A/B on HASQ ad creative" body="TOF Set 01 and Set 02 had near-identical CTR, suggesting the difference is audience, not creative. Test one image ad against one video ad in the same audience." />
        </InsightPanel>
      </div>
    </div>
  );
}

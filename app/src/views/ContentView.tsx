import { useMemo } from 'react';
import * as D from '../data/seedData';
import * as CFG from '../charts/configs';
import { getSeries } from '../lib/series';
import { int, pct } from '../lib/format';
import { TYPE_COLOR, MEDIA_COLOR } from '../theme';
import { PageHead, Rule, ChartCard, KpiGrid, InsightPanel, Insight, Recommendation, type Kpi } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard, Rank, EmptyRow } from '../components/Tables';
import { UploadZone, FilterBox } from '../components/Tools';
import { SnapshotGrid, pick, type SnapshotSpec } from './Snapshot';
import { match, type ViewCtx } from './context';

const KPIS: Kpi[] = [
  { label: 'Total Impressions', value: '254K', sub: 'All posts combined', badge: '254,813', grad: 'def', variant: 'g' },
  { label: 'Total Clicks', value: '9,070', sub: 'Avg CTR: 3.6%', badge: 'Clicks', grad: 'b', variant: 'b' },
  { label: 'Total Reactions', value: '3,263', sub: 'Likes + reactions', badge: 'Reactions', grad: 'def', variant: 'g' },
  { label: 'Total Comments', value: '145', sub: 'Across all posts', badge: 'Comments', grad: 'o', variant: 'b' },
  { label: 'Posts Tracked', value: '81', sub: 'Mar 2025 – Mar 2026', badge: 'PDF report', grad: 'p', variant: 'b' },
  { label: 'Best Eng. Rate', value: '14.1%', sub: 'Employer Branding posts', badge: 'Top type', grad: 'def', variant: 'g' },
];

interface MediaCard {
  icon: string; title: string; sub: string; accent: string; note: string;
  metrics: { l: string; v: string }[];
}

const MEDIA_CARDS: MediaCard[] = [
  { icon: '🎬', title: 'Video', sub: '16 posts', accent: MEDIA_COLOR.Video, note: '🏆 Best for engagement rate & CTR',
    metrics: [{ l: 'Avg Impressions', v: '1,693' }, { l: 'Avg Eng. Rate', v: '13.0%' }, { l: 'Avg CTR', v: '10.3%' }, { l: 'Avg Likes/Post', v: '41' }] },
  { icon: '🖼', title: 'Image', sub: '39 posts', accent: MEDIA_COLOR.Image, note: '📣 Best for total reach & volume scale',
    metrics: [{ l: 'Avg Impressions', v: '1,453' }, { l: 'Avg Eng. Rate', v: '10.7%' }, { l: 'Total Reach', v: '56.7K' }, { l: 'Avg Likes/Post', v: '23' }] },
  { icon: '📝', title: 'Text', sub: '21 posts', accent: MEDIA_COLOR.Text, note: '💡 Good for thought leadership · lowest reach',
    metrics: [{ l: 'Avg Impressions', v: '1,038' }, { l: 'Avg Eng. Rate', v: '4.9%' }, { l: 'Total Reach', v: '21.8K' }, { l: 'Avg Likes/Post', v: '22' }] },
  { icon: '📄', title: 'Article', sub: '5 posts', accent: MEDIA_COLOR.Article, note: '⚡ Newest format · still building audience',
    metrics: [{ l: 'Avg Impressions', v: '541' }, { l: 'Avg Eng. Rate', v: '5.5%' }, { l: 'Avg CTR', v: '3.5%' }, { l: 'Avg Likes/Post', v: '10' }] },
];

export function ContentView(ctx: ViewCtx) {
  const series = useMemo(() => getSeries('content', ctx.uploads), [ctx.uploads]);
  const monthly = useMemo(() => CFG.cMonthly(series, ctx), [series, ctx.isDark]);
  const cadence = useMemo(() => CFG.postsPerMonth(ctx), [ctx.isDark]);
  const avgImpr = useMemo(() => CFG.mediaAvgImpr(ctx), [ctx.isDark]);
  const engRate = useMemo(() => CFG.mediaEngRate(ctx), [ctx.isDark]);
  const stacked = useMemo(() => CFG.mediaStacked(ctx), [ctx.isDark]);
  const efficiency = useMemo(() => CFG.mediaEfficiency(ctx), [ctx.isDark]);
  const typeEng = useMemo(() => CFG.cPostTypeEng(ctx), [ctx.isDark]);
  const typeImp = useMemo(() => CFG.cPostTypeImp(ctx), [ctx.isDark]);

  const term = ctx.filters.content;
  const rows = D.TOP_POSTS.map((p, i) => ({ ...p, i })).filter((r) => match(term, [r.type, r.media, r.date]));

  const snap: SnapshotSpec[] = [];
  const imp = pick(series, ctx.selectedMonth);
  const eng = pick(series, ctx.selectedMonth, true);
  if (imp) snap.push({ label: 'Impressions — ' + ctx.selectedMonth, value: imp.value, prior: imp.prior, format: int });
  if (eng) snap.push({ label: 'Engagement — ' + ctx.selectedMonth, value: eng.value, prior: eng.prior, format: int });

  return (
    <div data-screen-label="Content">
      <PageHead
        title="Content Performance Report"
        subtitle="81 posts tracked · Oct 2025 – Jul 2026, plus the LinkedIn content export"
        chip="Total impressions: 254,813 · Reactions: 3,263 · Clicks: 9,070"
      />

      <div className="grid grid--tools">
        <UploadZone section="content" label="📤 Upload this month's Content export" status={ctx.status.content} onUpload={ctx.onUpload} />
        <FilterBox id="filter-content" label="🔎 Filter posts" placeholder="e.g. Video, Wishes" value={term} onChange={(v) => ctx.setFilter('content', v)} />
      </div>

      {ctx.viewMode === 'month' ? <SnapshotGrid items={snap} /> : <KpiGrid items={KPIS} />}

      <Rule>Monthly Content Performance</Rule>
      <div style={{ marginBottom: 20 }}>
        <ChartCard title="Monthly Impressions & Engagement" caption="Impressions (bars) vs reactions plus clicks (line) · April spike driven by viral Employer Branding">
          <ChartCanvas config={monthly} height="lg" summary="Monthly impressions peak in April 2026 at 75,799, with engagement peaking in January 2026 at 1,999." />
        </ChartCard>
      </div>

      <Rule>Post Cadence</Rule>
      <div style={{ marginBottom: 20 }}>
        <ChartCard title="Posts Published per Month" caption="Aug 2025 – Jul 2026 · based on the granular post-level export">
          <ChartCanvas config={cadence} height="sm" summary="Posts per month rise from 2 in August 2025 to a peak of 23 in April 2026." />
        </ChartCard>
      </div>

      <Rule>Media Type — Engagement Deep Dive</Rule>
      <div className="grid grid--media">
        {MEDIA_CARDS.map((m) => (
          <div className="mediacard" key={m.title} style={{ borderTop: '3px solid ' + m.accent }}>
            <div className="mediacard__head">
              <div className="mediacard__icon" style={{ background: m.accent + '26' }} aria-hidden="true">{m.icon}</div>
              <div>
                <div className="mediacard__title">{m.title}</div>
                <div className="mediacard__sub">{m.sub}</div>
              </div>
            </div>
            <div className="metricgrid">
              {m.metrics.map((mt) => (
                <div className="metric" key={mt.l}>
                  <div className="metric__l">{mt.l}</div>
                  <div className="metric__v" style={{ color: m.accent }}>{mt.v}</div>
                </div>
              ))}
            </div>
            <div className="mediacard__note" style={{ background: m.accent + '14' }}>{m.note}</div>
          </div>
        ))}
      </div>

      <div className="grid grid--charts">
        <ChartCard title="Avg Impressions per Post by Media Type" caption="Video tops at 1,693 avg · Image strong at 1,453 · Text and Article trail behind">
          <ChartCanvas config={avgImpr} height="sm" summary="Average impressions per post: Video 1,693, Image 1,453, Text 1,038, Article 541." />
        </ChartCard>
        <ChartCard title="Avg Engagement Rate by Media Type" caption="Video 13% → Image 10.7% → Article 5.5% → Text 4.9% · Video is 2.65× more engaging than text">
          <ChartCanvas config={engRate} height="sm" summary="Average engagement rate: Video 13.0%, Image 10.7%, Article 5.5%, Text 4.9%." />
        </ChartCard>
        <ChartCard title="Monthly Impressions by Media Type" caption="Image and text dominate volume · Video drives spikes in Sep, Oct and Jan · Articles emerging Apr–May 2026">
          <ChartCanvas config={stacked} summary="Stacked monthly impressions by media type, with image and text carrying most volume." />
        </ChartCard>
        <ChartCard title="Post Count vs Total Reach by Media" caption="Image publishes 2× more than video but gains only 2.1× more total reach — video is highly efficient">
          <ChartCanvas config={efficiency} summary="Post count against total impressions per media type, showing video's efficiency advantage." />
        </ChartCard>
      </div>

      <div className="grid grid--charts">
        <InsightPanel title="Key Media Insights">
          <Insight eyebrow="🎬 Video is your highest-ROI format" body="13% engagement rate and 10.3% CTR — the best numbers across all formats. Yet only 19% of posts are video. Every video post drives 2.65× more engagement than a text post for the same effort." />
          <Insight eyebrow="🖼 Image is your workhorse" body="39 image posts generate 56.7K total impressions — the biggest reach engine. Welcome aboard, Employee Milestone and Employer Branding posts are all image-based and consistently hit 1,400+ impressions each." />
          <Insight eyebrow="📝 Text works for thought leadership only" body="Lowest avg impressions (1,038) and lowest engagement (4.9%). But the Jan 23 text post hit 4,802 impressions, suggesting highly resonant thought leadership topics can break through regardless of format." />
          <Insight eyebrow="📄 Articles are nascent but promising" body="Only 5 articles posted (Apr–Jun 2026) — too early to judge. The Stanford AI Index series averaged 614 impressions with 5.5% engagement. Worth continuing to test for HASQ audience nurturing." />
        </InsightPanel>
        <InsightPanel title="Recommended Content Mix">
          <Recommendation accent={MEDIA_COLOR.Video} title="🎬 Video — Increase to 35%" body="Currently 19%. Target 2 videos per week. Use for Employer Branding, Company Culture and HASQ explainers. Highest follower-spike correlation." />
          <Recommendation accent={MEDIA_COLOR.Image} title="🖼 Image — Maintain at 40%" body="Keep welcome, milestone and wishes posts as image. Strong consistent reach. Batch-design four weeks at a time to reduce effort." />
          <Recommendation accent={MEDIA_COLOR.Text} title="📝 Text — Reduce to 15%" body="Reserve text-only for high-conviction thought leadership. Do not use for job posts or announcements — image outperforms every time." />
          <Recommendation accent={MEDIA_COLOR.Article} title="📄 Article — Scale to 10%" body="HASQ white papers and the Signal series belong here. Good for SEO-adjacent visibility and long-form nurturing of decision-makers." />
        </InsightPanel>
      </div>

      <Rule>Post Type &amp; Content Analysis</Rule>
      <div className="grid grid--charts">
        <ChartCard title="Engagement Rate by Post Type" caption="Employer Branding highest at 14.1% · Thought Leadership underperforms vs effort">
          <ChartCanvas config={typeEng} summary="Engagement rate by post type: Employer Branding 14.1%, Wishes 12.7%, Employee Milestone 12.6%, Job Opening 10.2%, Welcome aboard 8.6%, Thought Leadership 7.4%." />
        </ChartCard>
        <ChartCard title="Impressions by Post Type" caption="Welcome aboard and Thought Leadership drive most reach · each around 29K impressions">
          <ChartCanvas config={typeImp} summary="Impressions by post type led by Welcome aboard at 29,245 and Thought Leadership at 28,736." />
        </ChartCard>
      </div>

      <Rule>Top Posts by Impressions</Rule>
      <TableCard title="Best Performing Posts" caption="Ranked by impressions · Employer Branding and Welcome aboard posts dominate top spots" width="wide">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Date</th><th scope="col">Type</th><th scope="col">Media</th>
            <th scope="col">Impressions</th><th scope="col">Engagements</th><th scope="col">Reactions</th><th scope="col">Eng%</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? <EmptyRow cols={8} term={term} /> : rows.map((r) => {
            const color = TYPE_COLOR[r.type] || 'var(--sub)';
            return (
              <tr key={r.date + r.type}>
                <td><Rank i={r.i} isDark={ctx.isDark} /></td>
                <td>{r.date}</td>
                <td><span className="pill" style={{ background: color + '26', color }}>{r.type}</span></td>
                <td>{r.media}</td>
                <td className="td--strong">{int(r.impr)}</td>
                <td>{int(r.eng)}</td>
                <td>{int(r.react)}</td>
                <td>{pct((r.eng / r.impr) * 100)}</td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </div>
  );
}

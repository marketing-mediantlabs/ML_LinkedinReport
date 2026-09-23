import { useMemo } from 'react';
import * as D from '../data/seedData';
import * as CFG from '../charts/configs';
import { int, ratio } from '../lib/format';
import { RANK6, GREEN, BLUE, PURPLE } from '../theme';
import { PageHead, Rule, ChartCard, InsightPanel, Insight, Recommendation } from '../components/Primitives';
import { ChartCanvas } from '../components/ChartCanvas';
import { TableCard, Rank, EmptyRow } from '../components/Tables';
import { UploadZone, FilterBox } from '../components/Tools';
import { match, type ViewCtx } from './context';
import { sortKey } from '../lib/months';

export function CompetitorsView(ctx: ViewCtx) {
  const followers = useMemo(() => CFG.compFollowers(ctx), [ctx.isDark]);
  const reactions = useMemo(() => CFG.compReactions(ctx), [ctx.isDark]);
  const posts = useMemo(() => CFG.compPosts(ctx), [ctx.isDark]);
  const comments = useMemo(() => CFG.compComments(ctx), [ctx.isDark]);

  const term = ctx.filters.competitors;
  const rows = D.COMP.map((r, i) => ({ ...r, i })).filter((r) => match(term, [r.n]));
  const top6 = D.COMP.slice(0, 6);

  // Any uploaded competitor months, newest last.
  const history = useMemo(() => {
    const up = ctx.uploads.competitors || {};
    return Object.keys(up)
      .sort((a, b) => sortKey(a) - sortKey(b))
      .map((label) => {
        const list = up[label].rows || [];
        const mediant = list.find((r) => /mediant/i.test(r.n));
        return { label, mediant: mediant ? int(mediant.f) : '—', count: list.length };
      });
  }, [ctx.uploads]);

  return (
    <div data-screen-label="Competitors">
      <PageHead
        title="Competitor Benchmarking"
        subtitle="LinkedIn company page comparison · Oct 2025 – Sep 2026"
        chip="Same 12-month period for all competitors"
      />

      <div className="grid grid--tools">
        <UploadZone section="competitors" label="📤 Upload this month's Competitor export" status={ctx.status.competitors} onUpload={ctx.onUpload} />
        <FilterBox id="filter-competitors" label="🔎 Filter companies" placeholder="e.g. ELB" value={term} onChange={(v) => ctx.setFilter('competitors', v)} />
      </div>

      <Rule>New Followers Comparison</Rule>
      <div className="grid grid--mini">
        {top6.map((c, i) => (
          <div className="minicard" key={c.n}>
            {c.highlight ? <div className="minicard__accent" /> : null}
            <div className="minicard__name">{c.n}</div>
            <div className="minicard__value" style={{ color: RANK6[i] }}>{int(c.f)}</div>
            <div className="minicard__cap">New followers · #{i + 1}</div>
          </div>
        ))}
      </div>

      <Rule>Full Competitor Comparison</Rule>
      <div className="grid grid--charts">
        <ChartCard title="New Followers — All Competitors" caption="Mediant Labs at #6 · Close to ELB Learning at #5, on a fraction of the posts">
          <ChartCanvas config={followers} summary="New followers by competitor: Novac 58,571 leads, Mediant Labs sixth at 2,583." />
        </ChartCard>
        <ChartCard title="Reactions Comparison" caption="Mediant Labs reactions (3,665) competitive with ELB Learning (3,995) · Strong engagement quality">
          <ChartCanvas config={reactions} summary="Reactions by competitor: Novac 20,595 leads, Mediant Labs 3,665." />
        </ChartCard>
        <ChartCard title="Posts Volume" caption="Mediant Labs: 123 posts for 2,583 followers = 21.0 followers per post">
          <ChartCanvas config={posts} summary="Post volume by competitor: ELB Learning 524 leads, Mediant Labs 123." />
        </ChartCard>
        <ChartCard title="Comments Comparison" caption="Mediant Labs #2 in comments (195) — a higher comment rate than much larger competitors">
          <ChartCanvas config={comments} summary="Comments by competitor: Apposite 287 leads, Mediant Labs second at 195." />
        </ChartCard>
      </div>

      <Rule>Benchmarking Summary</Rule>
      <TableCard title="Full Competitor Metrics" caption="Same tracking period for every page" width="wide">
        <thead>
          <tr>
            <th scope="col">#</th><th scope="col">Company</th><th scope="col">New Followers</th>
            <th scope="col">Posts</th><th scope="col">Comments</th><th scope="col">Reactions</th>
            <th scope="col">Followers/Post</th><th scope="col">Reactions/Post</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? <EmptyRow cols={8} term={term} /> : rows.map((r) => (
            <tr key={r.n} style={r.highlight ? { background: 'var(--gg)' } : undefined}>
              <td><Rank i={r.i} isDark={ctx.isDark} /></td>
              <td className="td--strong">{r.n}</td>
              <td>{int(r.f)}</td>
              <td>{r.p}</td>
              <td>{r.c}</td>
              <td>{int(r.r)}</td>
              <td>{ratio(r.f, r.p)}</td>
              <td>{ratio(r.r, r.p)}</td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      {history.length > 0 ? (
        <>
          <Rule>Uploaded Competitor Snapshots</Rule>
          <TableCard title="Mediant Labs Followers by Uploaded Month" caption="Built from the competitor exports you have uploaded">
            <thead>
              <tr>
                <th scope="col">Month</th><th scope="col">Mediant Labs Followers</th><th scope="col">Companies in File</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.label}>
                  <td>{h.label}</td>
                  <td className="td--strong">{h.mediant}</td>
                  <td>{h.count}</td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        </>
      ) : null}

      <Rule>Strategic Positioning</Rule>
      <div className="grid grid--charts">
        <InsightPanel title="Where Mediant Labs Stands">
          <Insight eyebrow="📍 Position" body="Mediant Labs ranks #6 of 10 tracked pages in followers, but #2 in comments (195, behind only Apposite's 287) — indicating a high-quality, engaged audience versus volume-driven competitors." />
          <Insight eyebrow="⚡ Efficiency" body="21.0 followers per post versus Novac's 229.7. ELB Learning, the closest benchmark by category, gets 5.5 followers per post — Mediant Labs outperforms it by 3.8×." />
          <Insight eyebrow="🎯 Reactions quality" body="3,665 reactions on 123 posts equals 29.8 reactions per post. ELB Learning gets 7.6 per post on 524 posts. Mediant Labs is nearly 4× more reactive per post." />
        </InsightPanel>
        <InsightPanel title="Growth Opportunities">
          <Recommendation accent={GREEN} title="📈 Close the gap with ELB Learning" body="ELB has 2,900 followers on 524 posts. Mediant achieved 2,583 on just 123. At the current engagement quality, scaling to three or four posts a week could close this gap within months." />
          <Recommendation accent={BLUE} title="🌍 Geographic expansion" body="GP Strategies and Infopro Learning have US-dominant follower bases. Mediant's India concentration is an opportunity — Follower Ads targeting North America could shift this quickly." />
          <Recommendation accent={PURPLE} title="🎬 Video investment" body="Video posts drive the highest single-post spikes. Increasing from 19 to 24 or more video posts a year aligns with the content roadmap recommendation." />
        </InsightPanel>
      </div>
    </div>
  );
}

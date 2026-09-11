# ML LinkedIn Report

LinkedIn analytics reporting for Mediant Labs' company page — follower growth, page
visitors, content performance, ad campaigns and competitor benchmarking, with monthly
data upload and month-over-month trends.

The repo holds three things: a **standalone dashboard** you can just open, a **React
app** for developers, and a **design handoff** spec.

## 1. Standalone dashboard — start here

`linkedin-analytics-dashboard.html`

One self-contained file. Double-click it and it opens in any browser. No install, no
server, works offline. Email it or drop it on a shared drive and it opens for anyone.

Six sections in the sidebar: Followers, Visitors, Content, Ad Campaigns, Competitors,
and Month-over-Month. Dark/light toggle, a month picker, and an All-Time / This-Month
switch in the header.

### Uploading each month's data

Every section has its own upload zone, matching LinkedIn's separate exports. Both
`.csv` and `.pdf` are accepted — the file extension picks the parser.

- The reporting month is **detected from the file**, so you don't tag it manually.
- LinkedIn exports one row per **day**, so a file spanning several months is split
  per calendar month and each month totalled separately.
- Uploads **merge on top of** the built-in baseline history and accumulate from where
  you left off. Re-uploading a month overwrites just that month.
- PDFs **stage their figures for review** before saving — you see what was read and
  confirm or discard. CSVs save directly.
- Data persists in that browser's local storage. History is unlimited.
- The sidebar's "Data updated till" reflects the newest month you actually have.

A scanned or image-only PDF has no extractable text and will say so — export a fresh
one from LinkedIn. Competitor PDFs only yield a follower total, not the per-company
table, so use the CSV there for the full comparison.

**If a figure lands wrong**, the parser's column patterns are the thing to adjust —
see `lib/parseUpload.ts` in the React app, or the `extractValue` and `metricFromText`
methods in the `.dc.html` source.

### Editing the dashboard

`LinkedIn Analytics Dashboard.dc.html` is the source; the standalone file is compiled
from it and should not be hand-edited. It needs `support.js` alongside it to render.

## 2. React app — for developers

`app/`

React 18 + TypeScript + Vite. Chart.js for the charts, PapaParse and SheetJS for
`.csv` / `.xls` / `.xlsx` ingestion, real routes per section.

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # static bundle into dist/
npm run typecheck
```

`dist/` is fully static and works from `file://` too. See `app/README.md` for the
module layout and where to change things.

## 3. Design handoff — for rebuilding elsewhere

`design_handoff_linkedin_analytics_dashboard/`

A full specification for implementing this design in another codebase: colour and type
tokens, every view, all chart configs, the state model, CSV ingestion contract, and
accessibility gaps to close. Written for a developer who is not going to copy the
prototype's markup.

## Published dashboard

`index.html` is a landing page linking to the dashboard. With GitHub Pages enabled
(Settings → Pages → Deploy from branch → `main` / root), it serves at:

```
https://marketing-mediantlabs.github.io/ML_LinkedinReport/
```

Note that uploads there save to each viewer's own browser, not to a shared backend —
everyone sees the baseline history until they upload their own files.

## Data handling

Company exports are **not** committed. `uploads/` and common spreadsheet extensions
are listed in `.gitignore`. Baseline reporting figures are compiled into the dashboard
source itself (`DATA` in the `.dc.html`, `app/src/data/seedData.ts` in the React app).

## A note on two numbers

**Total Page Followers** is computed as a 207 pre-tracking base plus all tracked
growth, so it is arithmetic rather than the live LinkedIn count. If the two drift
apart, the base needs updating.

**Organic vs auto-invited** uses a fixed 97/3 split taken from the original export
rather than a per-month figure.

# Handoff: Mediant Labs LinkedIn Analytics Dashboard

## Overview

An internal marketing analytics dashboard for Mediant Labs' LinkedIn company page. It consolidates five reporting domains (Followers, Visitors, Content, Ad Campaigns, Competitors) into a single sidebar-navigated app, and lets a marketer upload LinkedIn's native monthly CSV exports to build a growing month-over-month history that persists locally.

Primary user: one marketing owner (Siva) who exports LinkedIn analytics monthly and needs both a consolidated all-time view and per-month detail, plus a stakeholder-ready presentation surface.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype that demonstrates the intended look, layout, data model, and interaction behavior. They are **not production code to copy directly**.

`LinkedIn Analytics Dashboard.dc.html` is authored in a proprietary in-house prototyping runtime ("Design Components"). It uses a custom `<x-dc>` template dialect with `{{ }}` holes, `<sc-for>` / `<sc-if>` control-flow tags, and a companion `support.js` runtime that compiles the template to React at load time. **Do not attempt to port `support.js` or the `<sc-*>` tags** — they are a prototyping convenience only.

The task is to **recreate this design in the target codebase's existing environment** using its established patterns, component library, and state management. If the project has no frontend yet, pick the most appropriate framework — React + TypeScript + Vite is the natural fit here, since the prototype's logic is already a React class component in spirit (state, lifecycle, derived render values) and Chart.js has first-class React bindings.

`support.js` is included **only** so you can open the prototype in a browser and interact with it as a reference. Open `LinkedIn Analytics Dashboard.dc.html` directly in Chrome — no server needed.

## Fidelity

**High-fidelity (hifi).** All colors, typography, spacing, border radii, chart configurations, and copy in this document are final and exact. Recreate the UI pixel-perfectly. Every hex value, px measurement, and string in this README is lifted verbatim from the prototype.

Two caveats where you should apply judgment rather than copy:
- **Font**: the prototype requests Google Sans, which is not publicly licensed for web embedding. See Typography below.
- **CSV parsing**: the prototype's parser is a pragmatic best-guess at LinkedIn's export column layout, written without a sample file. Treat it as a specification of intent, not a validated implementation. See CSV Ingestion below.

---

## Global Layout

Two-column app shell, `display: flex`, `min-height: 100vh`.

**Sidebar** — fixed 220px (`width: 220px; flex: 0 0 220px`), `position: sticky; top: 0; height: 100vh; overflow-y: auto`. Background `C.s`, `border-right: 1px solid C.br`. Vertical flex column:
- Wordmark "Mediant Labs" — `padding: 20px 18px 14px`, `font-size: 17px`, `font-weight: 800`, `letter-spacing: .2px`, filled with `linear-gradient(90deg,#21a866,#2189bd)` via `-webkit-background-clip: text; background-clip: text; color: transparent`.
- Nav list — `padding: 0 10px`, flex column, `gap: 2px`. Each item: `display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600`. Icon span at `font-size:15px`.
- Spacer (`flex: 1`).
- Footer stamp "Updated 10 Jul 2026" — `padding:14px 18px; font-size:9px`, color `C.sub`, `border-top: 1px solid C.br`.

**Main column** — `flex: 1; min-width: 0` (the `min-width:0` matters; without it the flex child refuses to shrink and wide tables break the layout), flex column.

**Header** — `position: sticky; top: 0; z-index: 200`, background `C.s`, `border-bottom: 1px solid C.br`, `padding: 12px 24px`, `display:flex; align-items:center; justify-content:flex-end; gap:12px; flex-wrap:wrap`. Contains, left to right: month `<select>`, All-Time/This-Month segmented toggle, theme toggle button.

**Content well** — `max-width: 1320px; margin: 0 auto; padding: 24px 22px 60px; width: 100%`.

### Navigation items

| Icon | Label | Tab id |
|---|---|---|
| 📈 | Followers | `followers` |
| 👁 | Visitors | `visitors` |
| 📝 | Content | `content` |
| 🎯 | Ad Campaigns | `ads` |
| 🏆 | Competitors | `competitors` |
| 🔁 | Month-over-Month | `mom` |

Sidebar is **always expanded with labels** — no collapse behavior (explicit product decision).

Active item: background `C.gg`, color `#21a866`. Inactive: background `transparent`, color `C.sub`.

---

## Design Tokens

### Color — dual theme

The entire palette resolves from a single `isDark` boolean into an object `C` consumed by every style. Implement as CSS custom properties on a `[data-theme]` root, or a theme object in context — not as inline styles.

| Token | Role | Dark | Light |
|---|---|---|---|
| `C.bg` | app background | `#0f1117` | `#f3f5f9` |
| `C.s` | surface (cards, sidebar, header) | `#181c27` | `#ffffff` |
| `C.s2` | recessed surface (table headers, inputs, inner tiles) | `#1e2335` | `#eef1f7` |
| `C.br` | borders & dividers | `#2a3047` | `#dde2ee` |
| `C.tx` | primary text | `#f0f2f8` | `#0c0c0c` |
| `C.sub` | secondary/muted text, axis ticks | `#8b93b0` | `#5a6280` |
| `C.gg` | green tint (active nav, badges, highlight rows) | `rgba(33,168,102,.15)` | `rgba(33,168,102,.08)` |
| `C.bb` | blue tint (badges) | `rgba(33,137,189,.15)` | `rgba(33,137,189,.08)` |

### Brand & accent colors

| Hex | Name | Usage |
|---|---|---|
| `#21a866` | Mediant green | primary accent, active state, positive delta, 2025 data series |
| `#2189bd` | Mediant blue | secondary accent, link color, 2026 data series |
| `#5ec7f5` | light blue | chart palette |
| `#6fedb5` | light green | chart palette |
| `#f5b942` | amber | chart palette |
| `#e07b2a` | orange | partial-month series, Article media type |
| `#9b59b6` | purple | Text media type, boost campaign |
| `#e74c3c` | red | negative delta, error status |
| `#1abc9c` | teal | chart palette |
| `#3498db` | blue | chart palette |

Categorical chart palette, in order:
`['#21a866','#2189bd','#5ec7f5','#6fedb5','#f5b942','#e07b2a','#9b59b6','#e74c3c','#1abc9c','#3498db']`

Media-type color map (used consistently across every Content chart and card — do not reassign):
`Video → #21a866`, `Image → #2189bd`, `Text → #9b59b6`, `Article → #e07b2a`

Post-type color map:
```
Employer Branding  → #21a866
Thought Leadership → #2189bd
Welcome aboard     → #9b59b6
Employee Milestone → #e07b2a
Job Opening        → #e74c3c
Wishes             → #f1c40f
```
Post-type badge background is the same hex with `26` alpha suffix (e.g. `#21a86626`).

Rank medal colors (rows 1–3 of every ranked table):
```
1st → bg rgba(255,196,0,.15)   text #ffc400
2nd → bg rgba(180,180,180,.15) text #b4b4b4
3rd → bg rgba(184,115,51,.15)  text #b87333
4th+ → bg C.s2                 text C.sub
```

KPI top-accent gradients (3px bar across the top of each KPI card):
```
def → linear-gradient(90deg,#21a866,#2189bd)
b   → linear-gradient(90deg,#2189bd,#5ec7f5)
o   → linear-gradient(90deg,#e07b2a,#f5b942)
p   → linear-gradient(90deg,#9b59b6,#c39bd3)
r   → linear-gradient(90deg,#e74c3c,#f1948a)
```

### Typography

Stack: `'Google Sans','Product Sans',Roboto,Helvetica,Arial,sans-serif`

**Important:** Google Sans / Product Sans are Google-proprietary and not licensed for web embedding. The prototype renders them only on machines where they happen to be installed; everyone else falls back to Roboto. In the real build, either (a) keep this stack and accept Roboto as the practical default, or (b) substitute the codebase's existing sans — Inter, Roboto, or the design system's own face. Do not attempt to self-host Google Sans.

Chart.js global default is set to the same stack.

| Element | Size | Weight | Notes |
|---|---|---|---|
| Sidebar wordmark | 17px | 800 | `letter-spacing:.2px`, gradient fill |
| Page `<h1>` | 21px | 700 | `margin: 0` |
| Page subtitle `<p>` | 12px | 400 | color `C.sub`, `margin: 3px 0 0` |
| Section rule label | 10px | 700 | uppercase, `letter-spacing: 1px`, color `C.sub` |
| Card `<h3>` | 12px | 700 | `margin: 0 0 2px` |
| Card sub-caption | 10px | 400 | color `C.sub`, `margin: 0 0 14px` |
| KPI label | 9px | 700 | uppercase, `letter-spacing: .8px`, color `C.sub` |
| KPI value | 28px | 800 | `line-height: 1` (26px in Ads tab and month-snapshot cards) |
| KPI sub-line | 10px | 400 | color `C.sub` |
| KPI badge | 9px | 600 | `padding: 2px 7px`, `border-radius: 8px` |
| Table header `<th>` | 9px | 700 | uppercase, `letter-spacing: .5px`, color `C.sub`, bg `C.s2` |
| Table cell `<td>` | 11px | 400 | 700 on the primary metric column |
| Nav item | 13px | 600 | |
| Insight card title | 11px | 700 | |
| Insight card body | 11px | 400 | `line-height: 1.5` |
| Footer stamp | 9px | 400 | color `C.sub` |
| Upload zone title | 11px | 700 | |
| Upload status line | 10px | 400 | color varies by state |

### Spacing, radius, borders

- Section rule → content gap: `12px`
- Card internal padding: `18px 20px` (charts/insights), `16px 18px` (KPIs), `12px 14px` (upload & filter tiles), `14px 18px 10px` (table headers)
- Table cell padding: `8px 16px`
- Grid gaps: `12px` (KPI grids), `16px` (chart pairs), `14px` (ad campaign cards), `10px` (competitor mini-cards)
- Bottom margin between blocks: `20px` (standard), `24px` (after KPI row), `28px` (MoM sections)
- Radius: `13px` cards · `12px` competitor mini-cards · `10px` upload tiles · `9px` insight cards · `8px` nav items, buttons, inputs, badges, inner tiles · `7px` ad metric tiles · `6px` bar chart corners · `50%` rank pills · `20px`/`16px` pill chips
- Borders: `1px solid C.br` throughout; `1px dashed C.br` on upload drop zones; `border-left: 4px solid <accent>` on ad campaign cards; `border-top: 3px solid <accent>` on media score cards
- Rank pill: `22px × 22px`, `border-radius: 50%`, inline-flex centered, `font-size: 9px`, `font-weight: 700`

### Responsive grids

All card grids use `repeat(auto-fit, minmax(<min>, 1fr))`:
- KPI rows: `minmax(175px, 1fr)` — `155px` on the Ads tab (8 KPIs), `220px`/`240px` for month-snapshot and upload rows
- Chart pairs: `minmax(380px, 1fr)`
- Ad campaign cards: `minmax(280px, 1fr)`
- Media score cards: `minmax(220px, 1fr)`
- Competitor mini-cards: `minmax(140px, 1fr)`

Wide tables sit in a wrapper with `overflow-x: auto` and the table gets `min-width: 640px` (competitors) or `min-width: 800px` (ad sets).

---

## Screens / Views

Six views, switched by sidebar. Only one renders at a time. Each carries a `data-screen-label` attribute.

### 1. Followers (`followers`) — default view

**Purpose:** Track organic follower growth, understand who the followers are, and upload the month's new export.

**Layout, top to bottom:**
1. Page title "Follower Growth Report" + subtitle "Full organic growth analysis · Apr 1, 2025 – Jul 8, 2026, plus your monthly uploads"
2. Two-tile row: CSV upload drop zone + location filter input
3. **Conditional KPI block** — month-snapshot cards (This Month mode) *or* the 9-card all-time KPI grid (All-Time mode)
4. Section: "Monthly Growth — Full Timeline" → bar chart, 320px tall, "Monthly New Followers"
5. Section: "Follower Audience Profile" → two doughnut charts side by side, 280px tall each: Seniority Distribution, Company Size
6. Section: "Top Follower Locations" → ranked table with inline distribution bars

**All-Time KPI cards (9):**

| Label | Value | Sub-line | Badge | Gradient | Value color |
|---|---|---|---|---|---|
| 🏠 Total Page Followers | 3,144 | Live count · LinkedIn page today | As of Jul 8, 2026 | def | `#21a866` |
| New Followers (Tracked) | 2,948 | Apr 1, 2025 → Jul 8, 2026 | 464 days | def | `C.tx` |
| Organic | 2,859 | 97.0% of all growth | ↑ 97.0% | def | `C.tx` |
| Auto-Invited | 89 | 3.0% of total | 3.0% | b | `C.tx` |
| Pre-tracking Base | 207 | Followers before Apr 1, 2025 | Historical | o | `C.tx` |
| Sponsored | 0 | No paid campaigns yet | Opportunity | o | `C.tx` |
| Peak Day | 218 | Jun 29, 2026 | All-time high | def | `C.tx` |
| Best Month | 510 | Jun 2026 | Monthly record | b | `C.tx` |
| Monthly Avg | 187 | Across 15 months | Avg | p | `C.tx` |

Badge variant `g` → bg `C.gg`, text `#21a866`. Variant `b` → bg `C.bb`, text `#2189bd`.

**Month-snapshot cards (This Month mode):** two cards — "New Followers — <month>" and a second derived metric. Each shows label (9px uppercase), value (26px/800), and a delta line (11px/600) colored `#21a866` for positive, `#e74c3c` for negative, `C.sub` for no prior month.

**Charts:**
- `monthlyFollowers` — Chart.js `bar`. Labels = month list. Per-bar color: 2025 months `rgba(33,168,102,.75)`, 2026 months `rgba(33,137,189,.75)`, partial/current month `rgba(224,123,42,.75)`. `borderWidth: 2` with the opaque variant as border, `borderRadius: 6`. Legend hidden.
- `fSeniority` — `doughnut`, `cutout: '58%'`, categorical palette, `borderWidth: 2`, border color `#181c27` (dark) / `#fff` (light), legend right, `boxWidth: 9`, `font-size: 10`, `padding: 6`.
- `fCsize` — same config as `fSeniority`.

**Locations table:** columns `#` (rank pill), Location, Followers, Share, Distribution. Distribution cell contains a `5px`-tall bar, `border-radius: 3px`, `background: linear-gradient(90deg,#21a866,#2189bd)`, width `= pct × 1.8` px, followed by a 9px `C.sub` label with `min-width: 32px; text-align: right`.

### 2. Visitors (`visitors`)

**Purpose:** Understand page-visit volume and visitor composition.

Same shell pattern. Title "Page Visitor Report", subtitle "LinkedIn company page visits · Jul 9, 2025 – Jul 8, 2026".

**All-Time KPIs (6):** Total Page Views 11,090 · Unique Visitors 4,102 (37% unique visit rate) · Best Month PV 1,404 (April 2026) · Best Month UV 472 (April 2026) · Avg PV/Month 853 · Avg UV/Month 316.

**Charts:**
- `vMonthly` — combo. Dataset 1: bar "Page Views", `rgba(33,137,189,.7)` fill, `#2189bd` border, `borderWidth: 1.5`, `borderRadius: 5`, `yAxisID: 'y'` (left). Dataset 2: line "Unique Visitors", `#21a866`, `borderWidth: 2`, `pointRadius: 3`, `tension: .4`, `fill: false`, `yAxisID: 'y1'` (right, `drawOnChartArea: false`). Legend visible, 10px.
- `vIndustry` — horizontal bar (`indexAxis: 'y'`), `rgba(33,137,189,.7)`, y-tick font 9px.
- `vJob` — horizontal bar, `rgba(33,168,102,.7)`.
- `vSeniority` — `polarArea`, palette with `cc` alpha suffix, radial grid `C.br`-ish, tick `backdropColor: 'transparent'`, font 8px.
- `vCsize` — vertical bar, `rgba(155,89,182,.7)`, `#9b59b6` border.

**Locations table:** same structure; distribution bar gradient is `linear-gradient(90deg,#2189bd,#5ec7f5)`, width `= pct × 1.2` px.

### 3. Content (`content`)

The densest view. Title "Content Performance Report".

**All-Time KPIs (6):** Total Impressions 254K · Total Clicks 9,070 (Avg CTR 3.6%) · Total Reactions 3,263 · Total Comments 145 · Posts Tracked 81 · Best Eng. Rate 14.1%.

**Blocks in order:**
1. Section "Monthly Content Performance" → `cMonthly` combo chart (impressions bars + reactions-plus-clicks line), 320px
2. Section "Post Cadence" → `postsPerMonth` bar chart, 240px, `rgba(33,168,102,.75)`, y `stepSize: 2`
3. Section "Media Type — Engagement Deep Dive" → four **media score cards**
4. Four-chart grid: `mediaAvgImpr`, `mediaEngRate`, `mediaStacked`, `mediaEfficiency`
5. Two insight panels: "Key Media Insights" and "Recommended Content Mix"
6. Section "Post Type & Content Analysis" → `cPostTypeEng` + `cPostTypeImp`, horizontal bars
7. Section "Top Posts by Impressions" → ranked table

**Media score card structure** (one per media type):
- Header row: `36×36` icon tile (`border-radius: 8px`, bg = accent at `.15` alpha, emoji at 18px) + title (13px/700) + sub (10px, `C.sub`)
- 2×2 metric grid, `gap: 8px`: each tile bg `C.s2`, `border-radius: 8px`, `padding: 8px 10px`, label 9px `C.sub`, value 18px/800 in the card accent
- Footer note: 10px, `C.sub`, bg = accent at `.08` alpha, `border-radius: 6px`, `padding: 6px 8px`
- Card gets `border-top: 3px solid <accent>`

| Card | Accent | Metrics | Note |
|---|---|---|---|
| 🎬 Video (16 posts) | `#21a866` | Avg Impressions 1,693 · Avg Eng. Rate 13.0% · Avg CTR 10.3% · Avg Likes/Post 41 | 🏆 Best for engagement rate & CTR |
| 🖼 Image (39 posts) | `#2189bd` | Avg Impressions 1,453 · Avg Eng. Rate 10.7% · Total Reach 56.7K · Avg Likes/Post 23 | 📣 Best for total reach & volume scale |
| 📝 Text (21 posts) | `#9b59b6` | Avg Impressions 1,038 · Avg Eng. Rate 4.9% · Total Reach 21.8K · Avg Likes/Post 22 | 💡 Good for thought leadership · lowest reach |
| 📄 Article (5 posts) | `#e07b2a` | Avg Impressions 541 · Avg Eng. Rate 5.5% · Avg CTR 3.5% · Avg Likes/Post 10 | ⚡ Newest format · still building audience |

**`mediaStacked`** — stacked bar, three datasets (Video / Image+Text / Article) at `.75` alpha of green / blue / orange, both axes `stacked: true`, `borderRadius: 4`.

**`mediaEfficiency`** — dual-axis bar: "Post Count" at `.4` alpha on left axis, "Total Impressions" at `.8` alpha on right axis, per-bar colors from the media map.

**Insight panel pattern** (reused on Ads and Competitors):
- Container: standard card, `<h3>` then a stack of tinted sub-cards with `margin-bottom: 9px` (last one none)
- "Key Media Insights" style sub-card: bg `C.s2`, `border: 1px solid C.br`, `border-radius: 9px`, `padding: 10px 12px`; eyebrow line 10px `C.sub` with emoji, body 11px `line-height: 1.5`
- "Recommendations" style sub-card: bg = accent at `.08`, `border: 1px solid` accent at `.2`, `border-radius: 9px`, `padding: 12px 14px`; title 11px/700 in the accent, body 11px `C.sub` `line-height: 1.5`

**Top Posts table:** `#`, Date, Type (colored badge — `padding: 2px 7px`, `border-radius: 5px`, 9px/600), Media, Impressions (700 weight), Engagements, Reactions, Eng% (computed `eng / impr × 100`, one decimal).

### 4. Ad Campaigns (`ads`)

Title "LinkedIn Ad Campaign Performance", subtitle "Account: Mediant Labs Inc. — Primary · Account ID: 516781033".

**All-Time KPIs (8, grid min 155px):** Total Ad Spend $1,649 · Total Impressions 104K · Total Clicks 78 · Overall CTR 0.07% · Avg CPM $14.31 · Video Views 64,967 · HASQ Clicks 69 · Avg CPC (HASQ) $17.38.

**Ad campaign cards (4)** — `border-left: 4px solid <accent>`:
- Header: title row (13px/700, emoji prefix) + period (10px `C.sub`) on the left; status pill on the right (`padding: 2px 8px`, `border-radius: 8px`, 9px/700, `white-space: nowrap`, bg = accent `.15`, `border: 1px solid` accent)
- Primary metric row: 3 tiles, `gap: 6px`, bg `C.s2`, `border-radius: 7px`, `padding: 8px`, centered; label 9px `C.sub`, value 16px/800 in accent
- Secondary metric row: 3 tiles, same shell, value 13px/700 in `C.tx`
- Footer note: 10px `C.sub`, `line-height: 1.4`

| Card | Accent | Primary | Secondary |
|---|---|---|---|
| 🔬 Pilot Campaign (PAUSED) | `#8b93b0` | Spend $100 · Impressions 11.3K · Vid Views 7,472 | Budget $100 · CPM $8.81 · View Rate 65.8% |
| 📢 ML_Boost — Video Post | `#9b59b6` | Spend $150 · Impressions 79.4K · Vid Views 64.9K | Budget $150 · CPM $1.88 · View Rate 81.8% |
| 🎯 ML-HASQ-TOF | `#21a866` | Spend $500 · Impressions 7,344 · Clicks 21 | Budget $500 · CTR 0.286% · CPC $23.81 |
| 🎯 ML-HASQ-MOF | `#2189bd` | Spend $700 · Impressions 12,270 · Clicks 48 | Budget $700 · CTR 0.391% · CPC $14.58 |

**Charts:** `adSpend` (doughnut, `cutout: '55%'`, per-campaign colors) · `adImpr` (bar) · `hasqCTR` (bar, 4 ad sets, `max: 0.55`) · `videoFunnel` (bar, 6 stages: 79,406 → 64,967 → 20,499 → 16,869 → 12,735 → 12,735) · `adInd` / `adJob` (horizontal bars) · `adSen` (doughnut) · `adLoc` (bar).

**Ad sets table** — 11 columns, `min-width: 800px`, horizontally scrollable: `#`, Campaign, Ad Set, Objective, Period, Spend, Impressions, Clicks, CTR, CPM, CPC. Conditional cell coloring: Impressions turns `#9b59b6` when `bigImpr`, CTR turns `#21a866` when `top`, CPM turns `#21a866` when `bestCpm`; all three are `font-weight: 700`.

**Two insight panels:** "What's Working" (4 sub-cards) and "Optimisation Recommendations" (4 accent sub-cards).

### 5. Competitors (`competitors`)

Title "Competitor Benchmarking".

1. Section "New Followers Comparison" → 6 **mini-cards**, grid min 140px, `border-radius: 12px`, `padding: 14px 16px`. Company name 10px/700 `line-height: 1.3`; value 22px/800 in a per-rank color from `['#e74c3c','#e07b2a','#f5b942','#9b59b6','#5ec7f5','#21a866']`; caption "New followers · #<rank>" 9px `C.sub`. The Mediant Labs card additionally gets a 3px top bar `linear-gradient(90deg,#21a866,#2189bd)` (card needs `position: relative; overflow: hidden`).
2. Four bar charts: `compFollowers`, `compReactions`, `compPosts`, `compComments`. Mediant Labs bar is `rgba(33,168,102,.8)` / `#21a866` border; all others `rgba(33,137,189,.6)` / `#2189bd`.
3. Full metrics table (`min-width: 640px`): `#`, Company (700 weight), New Followers, Posts, Comments, Reactions, Followers/Post, Reactions/Post. Last two are computed `f / max(p,1)` and `r / max(p,1)`, one decimal. The Mediant Labs row gets `background: C.gg`.
4. Two insight panels: "Where Mediant Labs Stands" (3 sub-cards) and "Growth Opportunities" (3 sub-cards).

### 6. Month-over-Month (`mom`)

Four identical sections, each `margin-bottom: 28px`:

| Section rule | Chart ref | Table metric column | Value format |
|---|---|---|---|
| Followers — New Followers per Month | `momFollowers` | New Followers | integer, locale-grouped |
| Visitors — Page Views per Month | `momVisitors` | Page Views | integer, locale-grouped |
| Content — Impressions per Month | `momContent` | Impressions | integer, locale-grouped |
| Ads — Spend per Month | `momAds` | Spend | `$` + locale-grouped |

Each section = section rule → bar chart card (240px canvas) → table card with columns Month / `<metric>` / vs Prior Month.

**Bar charts** were an explicit product choice over line charts ("best for comparing discrete months") — keep them as bars.

**Delta cell:** `font-weight: 600`. Positive → `↑ N.N%` in `#21a866`. Negative → `↓ N.N%` in `#e74c3c`. First row / no prior month → `—` in `C.sub`. Prior value of zero should render `—` rather than `Infinity%`.

> **Implementation note:** in the prototype, these four canvases each need a **direct top-level ref binding** (`refs.momFollowers` etc.). Passing a ref through a loop item did not mount the canvas. In React this is a non-issue — use a `useRef` per chart or a ref-callback map keyed by chart id.

---

## Interactions & Behavior

### Sidebar navigation
Click a nav item → sets `activeTab`, swaps the rendered view, resets scroll to top of content well. Active styling per Navigation table above. No route change in the prototype; in production, back these with real routes (`/followers`, `/visitors`, …) so views are linkable and the browser back button works.

### Month picker
`<select>` in the header listing every month present in the consolidated dataset (baseline history + uploads), most useful order is chronological. Changing it sets `selectedMonth`.

### All-Time / This Month toggle
Segmented control, two cells in a shared `C.s2` container with `border-radius: 8px; overflow: hidden`, each `padding: 6px 12px`, 11px/600. Active cell: bg `#21a866`, text `#fff`. Inactive: bg `transparent`, text `C.sub`.

- **All-Time** → KPI grids show running totals; charts show the full timeline.
- **This Month** → KPI grids are replaced by month-snapshot cards for `selectedMonth`, each with an auto-calculated ↑/↓ % delta vs the prior month.

Both modes were requested explicitly; the toggle is not optional polish.

### Theme toggle
Button in header, label `☀️ Light` when dark is active, `🌙 Dark` when light is active. Flips `isDark`. **Every chart must be destroyed and rebuilt on theme change** — Chart.js bakes tick/grid/border colors in at construction. In the prototype this is a `componentDidUpdate` comparison on `isDark` followed by a rebuild of the active tab's charts after an ~80ms timeout. In React, put chart construction in a `useEffect` with `[activeTab, isDark, data]` as deps and destroy the instance in the cleanup function.

### Global table search/filter
**One filter input per tab** applying across all tables on that tab (explicit product decision — not per-table boxes). Rendered as a bordered tile next to the upload zone: label (11px/700) + text input (`width: 100%`, `padding: 7px 10px`, `border-radius: 8px`, bg `C.s2`, 12px, `box-sizing: border-box`).

Matching is case-insensitive substring across the row's text fields. Filter state is held per tab so switching tabs doesn't clobber the other filters. Placeholder examples: `e.g. Chennai` (Followers), post type / company name equivalents elsewhere.

### CSV upload
One `<input type="file" accept=".csv">` per section — **five separate drop zones**, matching LinkedIn's separate exports (explicit product decision; not one combined zone).

Zone styling: card with `border: 1px dashed C.br`, `border-radius: 10px`, `padding: 12px 14px`. Title 11px/700 with 📤 prefix, e.g. "📤 Upload this month's Followers export (CSV)". Input at 11px, `color: C.sub`, `width: 100%`. Status line below at 10px, colored by state.

Status line states:
- idle → neutral `C.sub`
- success → `#21a866`, e.g. `Saved May 2026 · 445 new followers`
- partial → `#e07b2a`, naming what could not be read
- error → `#e74c3c`

`input[type=file]::-webkit-file-upload-button { cursor: pointer; }` is set globally.

### Hover / focus states
The prototype leans on `cursor: pointer` and does not define explicit hover styling for nav items, toggle cells, buttons, or table rows. **Add these in production** using the codebase's conventions — at minimum: nav item hover background `C.s2`; button hover border `#2189bd`; table row hover background `C.s2`; a visible focus ring on all inputs, the select, and every clickable div (which should become real `<button>` elements — see Accessibility).

### Empty, loading, error states
Not designed in the prototype. Specify in production:
- **Empty** — before any upload, the dashboard shows baseline seed history. If you choose to ship without seed data, each section needs an empty state pointing at its upload zone.
- **Loading** — CSV parse is synchronous and instant at these file sizes; a spinner is unnecessary. If parsing moves server-side, the upload tile needs a pending state.
- **Error** — surfaced inline in the upload zone's status line only. Consider a toast for parse failures.

### Responsive behavior
Grids reflow automatically via `auto-fit`/`minmax`. The 220px sidebar does **not** collapse in the prototype — below roughly 900px it should become a top bar or a drawer. Wide tables scroll horizontally inside their card. Header wraps via `flex-wrap: wrap`.

---

## State Management

Prototype state is a single component's `state` plus derived values recomputed each render.

**Persistent state (localStorage):**
```
uploads: {
  followers:   { [monthKey]: { newFollowers, organic, autoInvited, ... } },
  visitors:    { [monthKey]: { pageViews, uniqueVisitors, ... } },
  content:     { [monthKey]: { impressions, clicks, reactions, comments, posts } },
  ads:         { [monthKey]: { spend, impressions, clicks, ... } },
  competitors: { [monthKey]: [ { name, followers, posts, comments, reactions } ] }
}
```
`monthKey` is `YYYY-MM`. **Unlimited retention** — no rolling cap (explicit decision). **No reset/clear button** (explicit decision) — but do provide a way to recover from a corrupt localStorage payload: wrap the read in try/catch and fall back to seed data rather than white-screening.

**Ephemeral UI state:**
- `activeTab` — `'followers' | 'visitors' | 'content' | 'ads' | 'competitors' | 'mom'`, default `'followers'`
- `isDark` — boolean, default `true`
- `viewMode` — `'all' | 'month'`, default `'all'`
- `selectedMonth` — `monthKey` string
- `searchTerms` — `{ followers, visitors, content, ads, competitors }`, all `''`
- `uploadStatus` — per-section `{ text, state }`

**Derived (recompute, never store):**
- Consolidated month series per domain = baseline seed history merged with `uploads`, uploads winning on key collision
- MoM delta rows (value, prior value, % change, direction, color)
- Filtered table rows
- Rank-ordered lists and rank pill styles
- Ratio columns (Followers/Post, Reactions/Post, Eng%)

**Chart instances** are not state — hold them in a ref/map keyed by chart id, destroy before recreating, destroy on unmount.

### Merge semantics
Uploads **add on top of** the existing baseline history; the seed data is never wiped (explicit decision). Re-uploading a month **overwrites** that month's entry. Month is **auto-detected from the file's date range** (explicit decision) — no manual month picker at upload time.

---

## CSV Ingestion

This is the part most in need of hardening. The prototype's parser was written without a sample export and is a documented best-guess.

**Behavior on a non-matching file:** parse and save whatever is readable, then flag what was missing in the status line (explicit decision — do not reject the whole file).

**Known shape of LinkedIn's exports** (verify against real files before building):
- Followers export: date column + "Sponsored followers" / "Organic followers" / "Total followers" columns, one row per day
- Visitors export: date column + page-views and unique-visitor columns, often split across "All page views" / "Desktop" / "Mobile" sheets
- Content export: multi-sheet XLSX with an engagement sheet (one row per post: date, post type, impressions, clicks, reactions, comments, engagement rate) plus separate metrics sheets
- Competitor export: one row per tracked company with new followers, posts, comments, reactions
- Ads: exported from Campaign Manager, one row per campaign or ad set

Practical recommendations for the real build:
1. Use a real parser — **PapaParse** for CSV, **SheetJS (xlsx)** for LinkedIn's `.xls`/`.xlsx` exports. Several LinkedIn exports are genuinely Excel, not CSV, so widen `accept` to `.csv,.xls,.xlsx`.
2. Detect the export type from its header row rather than trusting which drop zone the user used.
3. Auto-detect the month by parsing the date column and taking the modal month; if a file spans two months, split it.
4. Normalize into the `uploads` shape above at the ingestion boundary so no view code ever touches raw CSV.
5. Keep a per-upload provenance record (filename, parsed-at timestamp, row count) — useful for debugging a wrong number six months later.

---

## Charts

**Library:** Chart.js 4.4.1 — the prototype loads `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js`. In production install from npm and use `react-chartjs-2` (or the framework equivalent) rather than a CDN script and manual `new Chart()`.

**Shared options on every chart:**
```js
responsive: true,
maintainAspectRatio: false,   // required — the canvas is sized by its wrapper
plugins: { legend: { display: false } },  // unless noted
scales: {
  x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
  y: { grid: { color: GRID }, ticks: { color: TICK } }
}
```
Where `GRID` = `rgba(255,255,255,.06)` dark / `rgba(0,0,0,.07)` light, and `TICK` = `#8b93b0` dark / `#5a6280` light.

Every canvas sits in a wrapper `<div style="position: relative; height: <N>px">`. Heights: 320px (primary timeline charts), 280px (audience/profile charts), 240px (secondary charts).

Chart.js global: `Chart.defaults.font.family = "'Google Sans','Product Sans',Roboto,sans-serif"`.

**Full chart inventory (29 charts):**

| Tab | Refs |
|---|---|
| Followers | `monthlyFollowers`, `fSeniority`, `fCsize` |
| Visitors | `vMonthly`, `vIndustry`, `vJob`, `vSeniority`, `vCsize` |
| Content | `cMonthly`, `postsPerMonth`, `mediaAvgImpr`, `mediaEngRate`, `mediaStacked`, `mediaEfficiency`, `cPostTypeEng`, `cPostTypeImp` |
| Ads | `adSpend`, `adImpr`, `hasqCTR`, `videoFunnel`, `adInd`, `adJob`, `adSen`, `adLoc` |
| Competitors | `compFollowers`, `compReactions`, `compPosts`, `compComments` |
| MoM | `momFollowers`, `momVisitors`, `momContent`, `momAds` |

Only the active tab's charts are built — do not construct all 29 up front.

---

## Seed Data

All baseline datasets are inlined as a `DATA` object literal in the prototype's logic class. Rather than re-transcribe every array here, **read them directly from the prototype file** — search for `const DATA={` in `LinkedIn Analytics Dashboard.dc.html`. It contains:

`MONTHS`, `F_TOT`, `F_CLR_BG`, `D25L`/`D25D`, `D26L`/`D26D`, `F_SEN_L`/`F_SEN_D`, `F_CS_L`/`F_CS_D`, `F_LOC`, `V_MONTHS`, `V_PV`, `V_UV`, `V_IND_L`/`V_IND_D`, `V_JOB_L`/`V_JOB_D`, `V_SEN_L`/`V_SEN_D`, `V_CS_L`/`V_CS_D`, `V_LOC`, `C_MONTHS`, `C_IMP`, `C_ENG`, `C_POST_TYPE_L`, `C_POST_ENG_R`, `C_POST_IMP`, `PC_MONTHS`, `PC_COUNT`, `STACK_MONTHS`, `STACK_VIDEO`, `STACK_IMGTXT`, `STACK_ARTICLE`, `MEDIA_L`, `MEDIA_AVG_IMPR`, `MEDIA_ENG_RATE`, `MEDIA_COUNT`, `MEDIA_TOTAL_IMPR`, `TOP_POSTS`, `COMP`, `ADS_CAMP`, `ADS_SPEND`, `ADS_IMPR`, `ADS_COLORS`, `ADS_BORDER`, `AD_SETS`, `AD_IND_L`/`AD_IND_D`, `AD_JOB_L`/`AD_JOB_D`, `AD_SEN_L`/`AD_SEN_D`, `AD_LOC_L`/`AD_LOC_D`, `AD_TITLES`.

This object is a faithful copy of the user's actual reporting numbers and can be lifted verbatim into a `seed-data.ts` module. Keep it separate from component code.

Note: daily follower arrays contain one negative value (`6/14` = `-1`, a real LinkedIn unfollow artifact). The prototype clamps with `Math.max(0, v)` at load. Decide whether to preserve or clamp — clamping loses information but avoids a chart dipping below zero.

Copy in this document — every KPI label, sub-line, badge, insight body, and recommendation — is final and should be used verbatim.

---

## Accessibility

Not addressed in the prototype. Required in production:
- Every clickable `<div>` (nav items, toggle cells) must be a real `<button>` or an anchor with proper role, `tabindex`, and Enter/Space handling.
- Nav needs `<nav>` + `aria-current="page"` on the active item.
- The All-Time/This-Month toggle should be a radiogroup or `aria-pressed` button pair.
- The theme toggle needs an `aria-label` — the emoji label alone is not a name.
- Tables need `<caption>` or an `aria-label`, and `scope="col"` on every `<th>`.
- Every chart needs a text alternative — the adjacent table usually serves; where there is no table, add a visually-hidden summary.
- Contrast: `C.sub` (`#8b93b0`) on `C.s` (`#181c27`) is roughly 5.3:1 — fine for the 10–11px body text at those weights, but verify the 9px uppercase labels against your standard. `#f5b942` and `#ffc400` on dark surfaces are below 4.5:1 for text; they are used for chart fills and rank pills, so confirm they never carry text-only meaning.
- File inputs need associated `<label>` elements, not just a nearby heading.

---

## Assets

No image, icon, or font files. All iconography is Unicode emoji rendered inline:

📈 👁 📝 🎯 🏆 🔁 (nav) · 🏠 (KPI) · 🎬 🖼 📄 (media types) · 🔬 📢 (campaigns) · 📤 🔎 (upload/filter) · ☀️ 🌙 (theme) · ✦ (Mediant Labs marker in competitor list) · 📍 ⚡ 💰 🌍 👔 🔁 📊 💡 📣 🏆 (insight eyebrows)

Emoji render inconsistently across platforms and are announced verbosely by screen readers. **Replace with a real icon set** (Lucide, Phosphor, or the codebase's existing set) in production, keeping the emoji as a mapping reference. Only one non-emoji glyph carries meaning: `✦` marks Mediant Labs in the competitor list, and `↑`/`↓` carry delta direction — pair those with color *and* text, never color alone.

No logo file exists; the "Mediant Labs" wordmark is gradient-filled live text. Swap for the real brand asset if one is available.

---

## Files in This Bundle

| File | What it is |
|---|---|
| `LinkedIn Analytics Dashboard.dc.html` | The design prototype. Template markup, logic class, and the full `DATA` seed object. Open in a browser to interact with it. |
| `support.js` | Prototyping runtime that makes the above render. **Reference only — do not port.** |
| `README.md` | This document. |

## Suggested Build Order

1. Scaffold the shell — theme tokens as CSS custom properties, two-column layout, sidebar, header, routing for the six views.
2. Port `DATA` verbatim into `seed-data.ts` with proper types.
3. Build the reusable primitives first: `KpiCard`, `SectionRule`, `ChartCard`, `RankedTable`, `InsightPanel`, `MediaScoreCard`, `UploadZone`. Almost everything else composes from these seven.
4. Build the Followers view end to end — it exercises every primitive. Get it pixel-matched before moving on.
5. Replicate across Visitors, Content, Ads, Competitors.
6. Add the month picker, All-Time/This-Month toggle, and MoM view once the consolidated-series derivation exists.
7. CSV ingestion last, against real export files, with the normalized `uploads` shape as the contract.

# Mediant Labs — LinkedIn Analytics Dashboard

A React + TypeScript app that consolidates LinkedIn company-page analytics across
Followers, Visitors, Content, Ad Campaigns and Competitors, with monthly CSV/Excel
upload and a month-over-month trend view.

## Running it

```bash
cd app
npm install
npm run dev
```

Opens at http://localhost:5173.

```bash
npm run build      # production bundle into dist/
npm run preview    # serve the built bundle
npm run typecheck  # tsc with no emit
```

`dist/` is fully static — drop it on any host, or open `dist/index.html` directly
(the router is a HashRouter and `base` is relative, so `file://` works too).

## What's where

```
src/
  main.tsx              entry, mounts the HashRouter
  App.tsx               shell + routes + shared view context
  index.css             all styling; theme via CSS custom properties
  theme.ts              colour tokens, palettes, rank styles, theme application
  types.ts              shared domain types
  data/seedData.ts      baseline history (the real reported numbers)
  lib/
    months.ts           month-label parsing and chronological sorting
    format.ts           number formatting and month-over-month deltas
    series.ts           merges baseline history with uploads
    parseUpload.ts      CSV/XLSX ingestion and column detection
  hooks/
    useTheme.ts         dark/light, persisted
    useUploads.ts       upload store, persisted, with per-section status
  charts/configs.ts     every Chart.js config, theme-aware
  components/           Shell, Primitives, Tables, Tools, ChartCanvas
  views/                one file per route
```

## Uploading monthly data

Each section has its own drop zone, matching LinkedIn's separate exports. Drop a
file or use the picker; `.csv`, `.xls` and `.xlsx` are all accepted.

- The month is **auto-detected** from the file's date column (modal month wins).
- Uploads **merge on top of** the baseline history — the seed data is never wiped.
- Re-uploading a month **overwrites** that month.
- Everything persists to `localStorage` under `ml-linkedin-dashboard-uploads-v1`.
- History is **unlimited** — no rolling cap.
- If a file only partly matches, whatever parsed is saved and the status line names
  what was missing rather than rejecting the file.

### Column detection

`lib/parseUpload.ts` matches columns by regex against lower-cased headers, because
LinkedIn renames them between export versions. The patterns were written without a
sample file — **verify them against your real exports and adjust**. Each section's
matcher is a short, isolated block in `parseUpload`, so this is a small edit.

## Adding a month to the baseline

Edit `src/data/seedData.ts`: append the label to the relevant `*_MONTHS` array and
the value to its paired data array. Keep them the same length.

## Notes

- **Font**: the stack requests Google Sans, which is not licensed for web embedding.
  It renders only where installed; everyone else gets Roboto. Swap the `--font`
  variable in `index.css` for your own face if you prefer.
- **Charts**: Chart.js bakes tick and grid colours in at construction, so every
  config is rebuilt on theme change. `ChartCanvas` destroys and recreates its
  instance whenever the config identity changes.
- **Icons** are Unicode emoji, carried over from the design. Replace with a real
  icon set (Lucide, Phosphor) for consistent cross-platform rendering.
- **No reset button** by design. To clear uploads during testing, run
  `localStorage.removeItem('ml-linkedin-dashboard-uploads-v1')` in the console.

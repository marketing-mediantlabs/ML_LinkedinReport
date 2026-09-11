import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar, Header } from './components/Shell';
import { FollowersView } from './views/FollowersView';
import { VisitorsView } from './views/VisitorsView';
import { ContentView } from './views/ContentView';
import { AdsView } from './views/AdsView';
import { CompetitorsView } from './views/CompetitorsView';
import { MomView } from './views/MomView';
import { useTheme } from './hooks/useTheme';
import { useUploads } from './hooks/useUploads';
import { allMonths } from './lib/series';
import type { SectionId, ViewMode } from './types';
import type { ViewCtx } from './views/context';

const NO_FILTERS: Record<SectionId, string> = {
  followers: '', visitors: '', content: '', ads: '', competitors: '',
};

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { uploads, status, upload } = useUploads();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [month, setMonth] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<SectionId, string>>(NO_FILTERS);

  const months = useMemo(() => allMonths(uploads), [uploads]);
  const selectedMonth = month ?? months[months.length - 1] ?? '';

  const ctx: ViewCtx = {
    isDark,
    viewMode,
    selectedMonth,
    uploads,
    status,
    onUpload: upload,
    filters,
    setFilter: (section, value) => setFilters((f) => ({ ...f, [section]: value })),
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setMonth}
          viewMode={viewMode}
          onViewMode={setViewMode}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        <main className="well">
          <Routes>
            <Route path="/" element={<Navigate to="/followers" replace />} />
            <Route path="/followers" element={<FollowersView {...ctx} />} />
            <Route path="/visitors" element={<VisitorsView {...ctx} />} />
            <Route path="/content" element={<ContentView {...ctx} />} />
            <Route path="/ads" element={<AdsView {...ctx} />} />
            <Route path="/competitors" element={<CompetitorsView {...ctx} />} />
            <Route path="/month-over-month" element={<MomView {...ctx} />} />
            <Route path="*" element={<Navigate to="/followers" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <span style={{ color: 'var(--green)' }}>Mediant Labs</span>
          {' '}LinkedIn Analytics · Followers Apr 2025 – Jul 2026 · Visitors &amp; Competitors Jul 2025 – Jul 2026
        </footer>
      </div>
    </div>
  );
}

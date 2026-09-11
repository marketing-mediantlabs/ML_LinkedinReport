import { NavLink } from 'react-router-dom';
import type { ViewMode } from '../types';

const NAV = [
  { to: '/followers', label: 'Followers', icon: '📈' },
  { to: '/visitors', label: 'Visitors', icon: '👁' },
  { to: '/content', label: 'Content', icon: '📝' },
  { to: '/ads', label: 'Ad Campaigns', icon: '🎯' },
  { to: '/competitors', label: 'Competitors', icon: '🏆' },
  { to: '/month-over-month', label: 'Month-over-Month', icon: '📊' },
];

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="wordmark">Mediant Labs</div>
      <nav className="nav" aria-label="Report sections">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => 'nav__item' + (isActive ? ' nav__item--active' : '')}
          >
            <span className="nav__icon" aria-hidden="true">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__spacer" />
      <div className="sidebar__stamp">Updated 10 Jul 2026</div>
    </div>
  );
}

interface HeaderProps {
  months: string[];
  selectedMonth: string;
  onMonthChange: (m: string) => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header(p: HeaderProps) {
  return (
    <header className="header">
      <label className="sr-only" htmlFor="month-picker">Reporting month</label>
      <select
        id="month-picker"
        className="control"
        value={p.selectedMonth}
        onChange={(e) => p.onMonthChange(e.target.value)}
      >
        {p.months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <div className="segmented" role="group" aria-label="Reporting range">
        <button
          type="button"
          className={'segmented__cell' + (p.viewMode === 'all' ? ' segmented__cell--active' : '')}
          aria-pressed={p.viewMode === 'all'}
          onClick={() => p.onViewMode('all')}
        >All-Time</button>
        <button
          type="button"
          className={'segmented__cell' + (p.viewMode === 'month' ? ' segmented__cell--active' : '')}
          aria-pressed={p.viewMode === 'month'}
          onClick={() => p.onViewMode('month')}
        >This Month</button>
      </div>

      <button
        type="button"
        className="control"
        onClick={p.onToggleTheme}
        aria-label={p.isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {p.isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}

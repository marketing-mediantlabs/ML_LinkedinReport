import type { ReactNode } from 'react';
import { GRAD } from '../theme';

export function PageHead({ title, subtitle, chip }: { title: string; subtitle: string; chip?: string }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {chip ? <span className="chip">{chip}</span> : null}
    </div>
  );
}

export function Rule({ children }: { children: ReactNode }) {
  return (
    <div className="rule">
      <span>{children}</span>
      <div className="rule__line" />
    </div>
  );
}

export function ChartCard({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="card__cap">{caption}</p>
      {children}
    </div>
  );
}

export interface Kpi {
  label: string;
  value: string;
  sub: string;
  badge: string;
  grad: 'def' | 'b' | 'o' | 'p' | 'r';
  variant: 'g' | 'b';
  valueColor?: string;
}

export function KpiCard({ kpi, tight }: { kpi: Kpi; tight?: boolean }) {
  const badgeBg = kpi.variant === 'g' ? 'var(--gg)' : 'var(--bb)';
  const badgeColor = kpi.variant === 'g' ? 'var(--green)' : 'var(--blue)';
  return (
    <div className="kpi">
      <div className="kpi__accent" style={{ background: GRAD[kpi.grad] }} />
      <div className="kpi__label">{kpi.label}</div>
      <div
        className={'kpi__value' + (tight ? ' kpi__value--sm' : '')}
        style={{ color: kpi.valueColor || 'var(--tx)' }}
      >
        {kpi.value}
      </div>
      <div className="kpi__sub">{kpi.sub}</div>
      <span className="kpi__badge" style={{ background: badgeBg, color: badgeColor }}>{kpi.badge}</span>
    </div>
  );
}

export function KpiGrid({ items, tight }: { items: Kpi[]; tight?: boolean }) {
  return (
    <div className={'grid ' + (tight ? 'grid--kpi-tight' : 'grid--kpi')}>
      {items.map((k) => <KpiCard key={k.label} kpi={k} tight={tight} />)}
    </div>
  );
}

export function InsightPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export function Insight({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="insight insight--plain">
      <div className="insight__eyebrow">{eyebrow}</div>
      <div className="insight__body">{body}</div>
    </div>
  );
}

export function Recommendation({ accent, title, body }: { accent: string; title: string; body: string }) {
  return (
    <div
      className="insight insight--accent"
      style={{ background: accent + '14', border: '1px solid ' + accent + '33' }}
    >
      <div className="insight__title" style={{ color: accent }}>{title}</div>
      <div className="insight__body insight__body--sub">{body}</div>
    </div>
  );
}

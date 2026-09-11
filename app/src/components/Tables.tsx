import type { ReactNode } from 'react';
import { rankStyle, DARK, LIGHT } from '../theme';

export function TableCard({ title, caption, children, width }: {
  title: string; caption: string; children: ReactNode; width?: 'wide' | 'xwide';
}) {
  return (
    <div className="tablecard">
      <div className="tablecard__head">
        <h3>{title}</h3>
        <p>{caption}</p>
      </div>
      <div className="tablecard__scroll">
        <table className={width || ''}>{children}</table>
      </div>
    </div>
  );
}

export function Rank({ i, isDark }: { i: number; isDark: boolean }) {
  const s = rankStyle(i, isDark ? DARK : LIGHT);
  return <span className="rank" style={{ background: s.bg, color: s.c }}>{i + 1}</span>;
}

export function BarCell({ pct, scale, tone }: { pct: number; scale: number; tone: 'g' | 'b' }) {
  return (
    <div className="bar-cell">
      <div className={'bar bar--' + tone} style={{ width: Math.round(pct * scale) }} />
      <span className="bar-cell__label">{pct}%</span>
    </div>
  );
}

export function EmptyRow({ cols, term }: { cols: number; term: string }) {
  return (
    <tr>
      <td className="empty-row" colSpan={cols}>No rows match “{term}”.</td>
    </tr>
  );
}

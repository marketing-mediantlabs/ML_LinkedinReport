export interface Tokens {
  bg: string; s: string; s2: string; br: string;
  tx: string; sub: string; gg: string; bb: string;
}

export const DARK: Tokens = {
  bg: '#0f1117', s: '#181c27', s2: '#1e2335', br: '#2a3047',
  tx: '#f0f2f8', sub: '#8b93b0',
  gg: 'rgba(33,168,102,.15)', bb: 'rgba(33,137,189,.15)',
};

export const LIGHT: Tokens = {
  bg: '#f3f5f9', s: '#ffffff', s2: '#eef1f7', br: '#dde2ee',
  tx: '#0c0c0c', sub: '#5a6280',
  gg: 'rgba(33,168,102,.08)', bb: 'rgba(33,137,189,.08)',
};

export const GREEN = '#21a866';
export const BLUE = '#2189bd';
export const RED = '#e74c3c';
export const ORANGE = '#e07b2a';
export const PURPLE = '#9b59b6';

export const PAL = ['#21a866','#2189bd','#5ec7f5','#6fedb5','#f5b942','#e07b2a','#9b59b6','#e74c3c','#1abc9c','#3498db'];

export const GRAD: Record<string, string> = {
  def: 'linear-gradient(90deg,#21a866,#2189bd)',
  b: 'linear-gradient(90deg,#2189bd,#5ec7f5)',
  o: 'linear-gradient(90deg,#e07b2a,#f5b942)',
  p: 'linear-gradient(90deg,#9b59b6,#c39bd3)',
  r: 'linear-gradient(90deg,#e74c3c,#f1948a)',
};

export const TYPE_COLOR: Record<string, string> = {
  'Employer Branding': '#21a866',
  'Thought Leadership': '#2189bd',
  'Welcome aboard': '#9b59b6',
  'Employee Milestone': '#e07b2a',
  'Job Opening': '#e74c3c',
  'Wishes': '#f1c40f',
};

export const MEDIA_COLOR: Record<string, string> = {
  Video: '#21a866', Image: '#2189bd', Text: '#9b59b6', Article: '#e07b2a',
};

export const RANK6 = ['#e74c3c','#e07b2a','#f5b942','#9b59b6','#5ec7f5','#21a866'];

export function gridColor(isDark: boolean) {
  return isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.07)';
}
export function tickColor(isDark: boolean) {
  return isDark ? '#8b93b0' : '#5a6280';
}
export function donutBorder(isDark: boolean) {
  return isDark ? '#181c27' : '#ffffff';
}

export interface RankStyle { bg: string; c: string }
export function rankStyle(i: number, t: Tokens): RankStyle {
  if (i === 0) return { bg: 'rgba(255,196,0,.15)', c: '#ffc400' };
  if (i === 1) return { bg: 'rgba(180,180,180,.15)', c: '#b4b4b4' };
  if (i === 2) return { bg: 'rgba(184,115,51,.15)', c: '#b87333' };
  return { bg: t.s2, c: t.sub };
}

export function applyTheme(isDark: boolean) {
  const t = isDark ? DARK : LIGHT;
  const r = document.documentElement;
  r.setAttribute('data-theme', isDark ? 'dark' : 'light');
  r.style.setProperty('--bg', t.bg);
  r.style.setProperty('--s', t.s);
  r.style.setProperty('--s2', t.s2);
  r.style.setProperty('--br', t.br);
  r.style.setProperty('--tx', t.tx);
  r.style.setProperty('--sub', t.sub);
  r.style.setProperty('--gg', t.gg);
  r.style.setProperty('--bb', t.bb);
}

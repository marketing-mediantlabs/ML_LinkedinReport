import { useEffect, useState } from 'react';
import { applyTheme } from '../theme';

const KEY = 'ml-linkedin-dashboard-theme-v1';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
    } catch { /* private mode */ }
    return true;
  });

  useEffect(() => {
    applyTheme(isDark);
    try { localStorage.setItem(KEY, isDark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark((v) => !v) };
}

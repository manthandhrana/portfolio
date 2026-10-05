import { useCallback, useState } from 'react';

/** Light/dark toggle. The initial value is set before render by public/theme-init.js. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage unavailable — the choice just won't persist */
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}

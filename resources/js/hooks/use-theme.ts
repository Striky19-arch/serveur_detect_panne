import { useCallback, useEffect, useState } from 'react';

export type ThemeName = 'default' | 'ocean' | 'forest';

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyThemeName = (theme: ThemeName) => {
  const t = theme === 'default' ? '' : theme;
  if (typeof document === 'undefined') return;
  if (t) {
    document.documentElement.setAttribute('data-theme', t);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

export function initializeThemeName() {
  try {
    const saved = (localStorage.getItem('themeName') as ThemeName) || 'default';
    applyThemeName(saved);
  } catch (_) {}
}

export function useTheme() {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const updateThemeName = useCallback((t: ThemeName) => {
    setThemeName(t);
    try {
      localStorage.setItem('themeName', t);
    } catch (_) {}
    setCookie('themeName', t);
    applyThemeName(t);
  }, []);

  useEffect(() => {
    try {
      const saved = (localStorage.getItem('themeName') as ThemeName) || 'default';
      updateThemeName(saved);
    } catch (_) {}
  }, [updateThemeName]);

  return { themeName, updateThemeName } as const;
}

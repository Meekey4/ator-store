'use client';
import { useEffect, useState } from 'react';

const THEME = 'ator_theme_v1', SIZE = 'ator_textsize_v1';
const SIZES = [0.9, 1, 1.12, 1.25];
const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const put = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

/** Runs before first paint so the saved theme and text size never flash. */
export const prefsScript = `try{var t=localStorage.getItem('${THEME}');if(t)document.documentElement.dataset.theme=t;var s=parseFloat(localStorage.getItem('${SIZE}'));if(s)document.documentElement.style.setProperty('--ts',s)}catch(e){}`;

export function ThemeToggle({ lang }: { lang: 'en' | 'ar' }) {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.dataset.theme === 'light'); }, []);
  const ar = lang === 'ar';
  const flip = () => { const next = light ? 'dark' : 'light'; document.documentElement.dataset.theme = next; put(THEME, next); setLight(!light); };
  const label = light ? (ar ? 'الوضع الداكن' : 'Dark mode') : (ar ? 'الوضع الفاتح' : 'Light mode');
  return (
    <button type="button" className="iconbtn icon-only" onClick={flip} aria-label={label} title={label}>
      {light
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
    </button>
  );
}

export function TextSize({ lang }: { lang: 'en' | 'ar' }) {
  const [i, setI] = useState(1);
  useEffect(() => { const s = parseFloat(get(SIZE) || '1'); const k = SIZES.indexOf(s); setI(k < 0 ? 1 : k); }, []);
  const ar = lang === 'ar';
  const apply = (k: number) => { const n = Math.max(0, Math.min(SIZES.length - 1, k)); setI(n); document.documentElement.style.setProperty('--ts', String(SIZES[n])); put(SIZE, String(SIZES[n])); };
  return (
    <div className="tsize" role="group" aria-label={ar ? 'حجم النص' : 'Text size'}>
      <span>{ar ? 'حجم النص' : 'Text size'}</span>
      <button type="button" onClick={() => apply(i - 1)} disabled={i === 0} aria-label={ar ? 'تصغير النص' : 'Smaller text'}>A−</button>
      <button type="button" onClick={() => apply(1)} aria-pressed={i === 1} aria-label={ar ? 'الحجم الافتراضي' : 'Default size'}>A</button>
      <button type="button" onClick={() => apply(i + 1)} disabled={i === SIZES.length - 1} aria-label={ar ? 'تكبير النص' : 'Larger text'}>A+</button>
    </div>
  );
}

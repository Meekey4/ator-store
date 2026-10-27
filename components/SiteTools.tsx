'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Back-to-top button, "/" to search, and auto-submit for filters. */
export function SiteTools({ lang }: { lang: 'en' | 'ar' }) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || t.closest('input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      const box = document.querySelector<HTMLInputElement>('[data-search]');
      if (box) box.focus(); else router.push(`/${lang}/shop#shop-q`);
    };
    const onChange = (e: Event) => { const el = e.target as HTMLInputElement; if (el.matches('[data-autosubmit]')) el.form?.requestSubmit(); };
    onScroll();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('change', onChange);
    if (location.hash === '#shop-q') document.getElementById('shop-q')?.focus();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); document.removeEventListener('change', onChange); };
  }, [lang, router, path]);
  return (
    <button type="button" className={`totop ${show ? 'on' : ''}`} aria-label={lang === 'ar' ? 'العودة إلى الأعلى' : 'Back to top'} tabIndex={show ? 0 : -1}
      onClick={() => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true }); }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}

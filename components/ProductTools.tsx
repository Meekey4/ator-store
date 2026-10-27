'use client';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { RECENT, SAVED, readList, writeList } from '@/lib/local';

export function ProductTools({ lang, slug, name }: { lang: Lang; slug: string; name: string }) {
  const ar = lang === 'ar';
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(window.location.origin + window.location.pathname);
    setSaved(readList(SAVED).includes(slug));
    writeList(RECENT, [slug, ...readList(RECENT).filter((s) => s !== slug)].slice(0, 8));
  }, [slug]);
  const toggle = () => {
    const list = readList(SAVED);
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list];
    writeList(SAVED, next); setSaved(next.includes(slug));
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  const text = encodeURIComponent(`${name} · ATOR`);
  const u = encodeURIComponent(url);
  return (
    <div className="ptools">
      <button type="button" className="btn ghost sm" aria-pressed={saved} onClick={toggle}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
        {saved ? (ar ? 'محفوظ' : 'Saved') : (ar ? 'احفظ لوقت لاحق' : 'Save for later')}
      </button>
      <span className="ptools-share" aria-label={ar ? 'مشاركة' : 'Share'}>
        <a className="btn ghost sm" href={`https://wa.me/?text=${text}%20${u}`} target="_blank" rel="noreferrer">{ar ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</a>
        <a className="btn ghost sm" href={`https://x.com/intent/post?text=${text}&url=${u}`} target="_blank" rel="noreferrer">{ar ? 'مشاركة على X' : 'Share on X'}</a>
        <button type="button" className="btn ghost sm" onClick={copy}>{copied ? (ar ? 'تم نسخ الرابط' : 'Link copied') : (ar ? 'نسخ الرابط' : 'Copy link')}</button>
      </span>
      <span role="status" aria-live="polite" className="sr-only">{copied ? (ar ? 'تم نسخ الرابط' : 'Link copied') : ''}</span>
    </div>
  );
}

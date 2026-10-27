'use client';
import { useState } from 'react';

export function CopyButton({ text, lang }: { text: string; lang: 'en' | 'ar' }) {
  const [done, setDone] = useState(false);
  const ar = lang === 'ar';
  return (
    <button type="button" className="btn ghost sm" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { /* ignore */ } }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
      <span aria-live="polite">{done ? (ar ? 'تم النسخ' : 'Copied') : (ar ? 'نسخ التفاصيل' : 'Copy details')}</span>
    </button>
  );
}

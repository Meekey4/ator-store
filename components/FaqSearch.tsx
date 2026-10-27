'use client';
import { useState } from 'react';
import { FAQS } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

export function FaqSearch({ lang }: { lang: Lang }) {
  const [q, setQ] = useState('');
  const ar = lang === 'ar';
  const n = q.trim().toLowerCase();
  const list = FAQS.filter((f) => !n || (f.q[lang] + ' ' + f.a[lang]).toLowerCase().includes(n));
  return (
    <>
      <label className="sr-only" htmlFor="faq-q">{ar ? 'ابحث في الأسئلة' : 'Search questions'}</label>
      <input id="faq-q" type="search" className="faq-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ar ? 'ابحث في الأسئلة، مثل: استرداد' : 'Search questions, e.g. refund'} data-search />
      <p className="muted" aria-live="polite" style={{ margin: '10px 0 14px', fontSize: 14 }}>{ar ? `${list.length} من ${FAQS.length} أسئلة` : `${list.length} of ${FAQS.length} questions`}</p>
      <div className="faq">
        {list.map((f, i) => <details key={f.q.en} className="glass" open={!!n || i === 0}><summary>{f.q[lang]}</summary><p>{f.a[lang]}</p></details>)}
      </div>
      {!list.length ? <p className="muted">{ar ? 'لم نجد إجابة. راسلنا عبر واتساب وسنساعدك.' : 'No answer found. Message us on WhatsApp and we’ll help.'}</p> : null}
    </>
  );
}

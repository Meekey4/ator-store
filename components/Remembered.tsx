'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { RECENT, SAVED, readList, writeList } from '@/lib/local';

type Mini = { slug: string; name: string; image: string; price: number | null };

/** "Saved for later" and "Recently viewed" rows. Live only in this browser; hidden when empty. */
export function Remembered({ lang, products }: { lang: Lang; products: Mini[] }) {
  const ar = lang === 'ar';
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    const load = () => { setSaved(readList(SAVED)); setRecent(readList(RECENT)); };
    load(); window.addEventListener('ator-local', load); window.addEventListener('storage', load);
    return () => { window.removeEventListener('ator-local', load); window.removeEventListener('storage', load); };
  }, []);
  const by = Object.fromEntries(products.map((p) => [p.slug, p]));
  const row = (title: string, list: string[], removable: boolean) => {
    const items = list.map((s) => by[s]).filter(Boolean) as Mini[];
    if (!items.length) return null;
    return (
      <section className="section remembered">
        <div className="section-h"><h2>{title}</h2></div>
        <div className="mini-row">
          {items.map((p) => (
            <div key={p.slug} className="mini glass">
              <Link href={`/${lang}/p/${p.slug}`}>
                <img src={p.image} alt={p.name} width={96} height={96} loading="lazy" />
                <span><b>{p.name}</b>{p.price != null ? <span className="num muted">{bhd(p.price, lang)}</span> : null}</span>
              </Link>
              {removable ? <button type="button" className="x" aria-label={(ar ? 'إزالة ' : 'Remove ') + p.name} onClick={() => writeList(SAVED, readList(SAVED).filter((x) => x !== p.slug))}>×</button> : null}
            </div>
          ))}
        </div>
      </section>
    );
  };
  return <>{row(ar ? 'محفوظ لوقت لاحق' : 'Saved for later', saved, true)}{row(ar ? 'شاهدتها مؤخرًا' : 'Recently viewed', recent, false)}</>;
}

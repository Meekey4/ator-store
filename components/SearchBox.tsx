'use client';
import Link from 'next/link';
import { useId, useState } from 'react';
import { bhd } from '@/lib/money';

type Item = { slug: string; name: string; alt: string; cat: string; image: string; price: number | null };

/** Search with live suggestions. Matches English and Arabic names and the category; Enter still runs the full search. */
export function SearchBox({ lang, items, defaultValue, placeholder }: { lang: 'en' | 'ar'; items: Item[]; defaultValue: string; placeholder: string }) {
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(-1);
  const id = useId();
  const n = q.trim().toLowerCase();
  const hits = n ? items.filter((it) => `${it.name} ${it.alt} ${it.cat}`.toLowerCase().includes(n)).slice(0, 6) : [];
  const show = open && hits.length > 0;
  return (
    <div className="sbox">
      <input id="shop-q" name="q" type="search" value={q} placeholder={placeholder} data-search autoComplete="off"
        role="combobox" aria-expanded={show} aria-controls={id} aria-autocomplete="list" aria-activedescendant={act >= 0 ? `${id}-${act}` : undefined}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setAct(-1); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setAct((a) => Math.min(hits.length - 1, a + 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setAct((a) => Math.max(-1, a - 1)); }
          else if (e.key === 'Enter' && act >= 0) { e.preventDefault(); window.location.href = `/${lang}/p/${hits[act].slug}`; }
          else if (e.key === 'Escape') setOpen(false);
        }} />
      {show ? (
        <ul id={id} role="listbox" className="sugg">
          {hits.map((h, i) => (
            <li key={h.slug} id={`${id}-${i}`} role="option" aria-selected={i === act}>
              <Link href={`/${lang}/p/${h.slug}`} tabIndex={-1}>
                <img src={h.image} alt="" width={40} height={40} />
                <span><b>{h.name}</b><small>{h.cat}</small></span>
                {h.price != null ? <span className="num">{bhd(h.price, lang)}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

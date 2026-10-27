'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './Cart';
import { dict, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';

type P = { id: string; label: string; price: number; stock: number };

export function PlanPicker({ lang, slug, name, plans }: { lang: Lang; slug: string; name: string; plans: P[] }) {
  const d = dict(lang);
  const first = plans.find((p) => p.stock > 0) ?? plans[0];
  const [sel, setSel] = useState(first?.id);
  const { add, flash } = useCart();
  const router = useRouter();
  const cur = plans.find((p) => p.id === sel);
  if (!plans.length) return <div className="notice">{d.comingSoon}</div>;
  const can = !!cur && cur.stock > 0;
  return (
    <>
      <h3>{d.choosePlan}</h3>
      <div className="plans" role="radiogroup" aria-label={d.choosePlan}>
        {plans.map((p) => (
          <button key={p.id} type="button" role="radio" className="plan" aria-checked={sel === p.id} disabled={p.stock <= 0} onClick={() => setSel(p.id)}>
            <span className="radio" />
            <span className="pl">{p.label}<span className="st">{p.stock > 0 ? (p.stock <= 3 ? `${p.stock} ${d.inStock}` : d.instant) : d.outOfStock}</span></span>
            <span className="price num">{bhd(p.price, lang)}</span>
          </button>
        ))}
      </div>
      <div className="buybar">
        <div className="total"><div className="muted" style={{ fontSize: 13 }}>{d.total}</div><div className="price num" style={{ fontSize: 24 }}>{cur ? bhd(cur.price, lang) : '—'}</div></div>
        <button className="btn ghost" disabled={!can} onClick={() => { add({ slug, planId: sel! }); flash(`${d.added}: ${name}`); }}>{d.addToCart}</button>
        <button className="btn primary" disabled={!can} onClick={() => { add({ slug, planId: sel! }); router.push(`/${lang}/checkout`); }}>{d.payNow}</button>
      </div>
    </>
  );
}

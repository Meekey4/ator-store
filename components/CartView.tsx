'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './Cart';
import { dict, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';

export type Info = Record<string, { name: string; image: string; plans: Record<string, { label: string; price: number; stock: number }> }>;
type Me = { name: string; email: string; phone: string } | null;

export function CartView({ lang, info, mode, me = null }: { lang: Lang; info: Info; mode: 'cart' | 'checkout'; me?: Me }) {
  const d = dict(lang);
  const { lines, setQty, ready, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const rows = lines.map((l) => ({ ...l, p: info[l.slug], plan: info[l.slug]?.plans[l.planId] })).filter((r) => r.p && r.plan);
  const total = rows.reduce((s, r) => s + r.plan!.price * r.qty, 0);

  if (!ready) return <div className="wrap" style={{ minHeight: '40vh' }} />;
  if (!rows.length) return (
    <div className="wrap" style={{ padding: '70px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 34 }}>{d.cartEmpty}</h1>
      <Link className="btn primary" style={{ marginTop: 24 }} href={`/${lang}/shop`}>{d.continueShopping}</Link>
    </div>
  );

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, name: f.get('name'), email: f.get('email'), phone: f.get('phone'), items: rows.map((r) => ({ slug: r.slug, planId: r.planId, qty: r.qty })) }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error');
      clear();
      window.location.href = j.redirect;
    } catch (x) { setErr((x as Error).message); setBusy(false); }
  }

  return (
    <div className="wrap two">
      <div className="glass pad">
        <h1 style={{ fontSize: 30, marginBottom: 10 }}>{mode === 'cart' ? d.cart : d.checkout}</h1>
        {rows.map((r) => (
          <div className="line" key={r.slug + r.planId}>
            <img src={r.p!.image} alt="" width={72} height={72} />
            <div>
              <div style={{ fontWeight: 600 }}>{r.p!.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{r.plan!.label}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
                <span className="qty" aria-label={d.qty}>
                  <button type="button" onClick={() => setQty(r.slug, r.planId, r.qty - 1)} aria-label="−">−</button>
                  <span className="num">{r.qty}</span>
                  <button type="button" onClick={() => setQty(r.slug, r.planId, Math.min(r.qty + 1, r.plan!.stock))} aria-label="+">+</button>
                </span>
                <button type="button" className="linkbtn" onClick={() => setQty(r.slug, r.planId, 0)}>{d.remove}</button>
              </div>
            </div>
            <div className="price num">{bhd(r.plan!.price * r.qty, lang)}</div>
          </div>
        ))}
      </div>
      <div className="glass pad">
        <div className="sumrow"><span className="muted">{d.subtotal}</span><span className="num">{bhd(total, lang)}</span></div>
        <div className="sumrow big"><span>{d.total}</span><span className="num">{bhd(total, lang)}</span></div>
        {mode === 'cart' ? (
          <Link className="btn primary block" style={{ marginTop: 18 }} href={`/${lang}/checkout`}>{d.checkout}</Link>
        ) : (
          <form onSubmit={pay} style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12 }}>{d.yourDetails}</h3>
            <label className="field"><span>{d.name}</span><input name="name" required autoComplete="name" defaultValue={me?.name} /></label>
            <label className="field"><span>{d.email}</span><input name="email" type="email" required autoComplete="email" defaultValue={me?.email} /></label>
            <label className="field"><span>{d.phone}</span><input name="phone" type="tel" required autoComplete="tel" placeholder="+973 3xxx xxxx" defaultValue={me?.phone} /></label>
            {err ? <div className="err" role="alert">{err}</div> : null}
            <button className="btn primary block" disabled={busy}>{busy ? d.placing : `${d.payNow} · ${bhd(total, lang)}`}</button>
            <p className="note">{d.payNote} {d.agree}</p>
          </form>
        )}
      </div>
    </div>
  );
}

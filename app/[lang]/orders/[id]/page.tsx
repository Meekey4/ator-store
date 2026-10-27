import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrder, markPaid, updateOrder } from '@/lib/db';
import { currentUser, isAdmin } from '@/lib/auth';
import { getCharge, paymentsEnabled } from '@/lib/tap';
import { STATUS, dict, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order', robots: { index: false } };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ lang: Lang; id: string }>; searchParams: Promise<{ t?: string; tap_id?: string }> }) {
  const { lang, id } = await params;
  const sp = await searchParams;
  const d = dict(lang);
  let o = await getOrder(id);
  const u = await currentUser();
  if (!o || !(sp.t === o.token || (u && (o.user_id === u.id || o.email === u.email)) || isAdmin(u))) notFound();

  // Returning from Tap: confirm with Tap's API, not the URL.
  const ref = sp.tap_id || o.payment_ref;
  if (paymentsEnabled() && ref && o.status === 'pending') {
    const ch = await getCharge(ref);
    if (ch?.order === o.id && ch.status === 'CAPTURED') o = (await markPaid(o.id, ch.id, ch.method)) ?? o;
    else if (ch && ch.order === o.id && !['INITIATED', 'IN_PROGRESS'].includes(ch.status)) { await updateOrder(o.id, { status: 'failed' }); o = { ...o, status: 'failed' }; }
  }
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const waLink = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`ATOR ${o.id}`)}` : '';

  return (
    <div className="wrap two">
      <div className="glass pad">
        <span className="eyebrow">{d.order}</span>
        <h1 style={{ fontSize: 34, margin: '8px 0 6px' }} className="num">{o.id}</h1>
        <p className={`st-${o.status}`} style={{ fontWeight: 600, margin: '0 0 18px' }}>{STATUS[o.status]?.[lang] ?? o.status}</p>
        {o.status === 'paid' && sp.tap_id ? <div className="notice ok" style={{ marginBottom: 16 }}>{d.thanks}</div> : null}
        {o.status === 'pending' && !paymentsEnabled() ? <div className="notice" style={{ marginBottom: 16 }}>{d.payPending}{waLink ? <> <a href={waLink} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">WhatsApp</a></> : null}</div> : null}
        {o.status === 'failed' ? <div className="notice bad" style={{ marginBottom: 16 }}>{d.payFailed} {paymentsEnabled() ? <a href={`/api/pay?o=${o.id}&t=${o.token}`} style={{ textDecoration: 'underline' }}>{d.tryAgain}</a> : null}</div> : null}
        <h3 style={{ margin: '10px 0 8px' }}>{d.delivery}</h3>
        {o.status === 'delivered' && o.delivery ? <pre className="delivery">{o.delivery}</pre> : <p className="muted">{d.deliveryWait}</p>}
      </div>
      <div className="glass pad">
        <h3 style={{ marginBottom: 6 }}>{d.items}</h3>
        {o.items.map((i) => (
          <div className="sumrow" key={i.slug + i.planId}>
            <span>{t(i.name, lang)} <span className="muted">· {t(i.plan, lang)} × {i.qty}</span></span>
            <span className="num">{bhd(i.price * i.qty, lang)}</span>
          </div>
        ))}
        <div className="sumrow big"><span>{d.total}</span><span className="num">{bhd(o.total, lang)}</span></div>
        <p className="note">{d.date}: {new Date(o.created_at).toLocaleString(lang === 'ar' ? 'ar-BH' : 'en-GB', { timeZone: 'Asia/Bahrain' })}</p>
        <Link className="btn ghost block" style={{ marginTop: 14 }} href={`/${lang}/shop`}>{d.continueShopping}</Link>
      </div>
    </div>
  );
}

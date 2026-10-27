import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrder, markPaid, updateOrder } from '@/lib/db';
import { currentUser, isAdmin } from '@/lib/auth';
import { getCharge, paymentsEnabled } from '@/lib/tap';
import { STATUS, dict, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { CopyButton } from '@/components/CopyButton';
import { Crumbs } from '@/components/Seo';
import { PROMISE } from '@/lib/content';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; id: string }> }): Promise<Metadata> { const { lang, id } = await params; return { title: `${lang === 'ar' ? 'الطلب' : 'Order'} ${id}`, robots: { index: false, follow: false } }; }

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

  const ar = lang === 'ar';
  const first = (o.name || '').split(' ')[0];
  const step = o.status === 'delivered' ? 3 : o.status === 'paid' ? 2 : o.status === 'pending' ? 1 : 0;
  const steps = ar ? ['تم استلام الطلب', 'تم الدفع', 'تم التسليم'] : ['Order received', 'Payment confirmed', 'Delivered'];
  return (
    <div className="wrap">
    <Crumbs items={[{ name: 'ATOR', href: `/${lang}` }, ...(u ? [{ name: d.account, href: `/${lang}/account` }] : []), { name: `${d.order} ${o.id}` }]} />
    {['pending', 'paid', 'delivered'].includes(o.status) ? (
      <section className="thanks glass pad">
        <h1>{o.status === 'delivered' ? (ar ? `طلبك جاهز يا ${first}` : `Your order is ready, ${first}`) : (ar ? `شكرًا لك يا ${first}!` : `Thank you, ${first}!`)}</h1>
        <p className="muted">{o.status === 'delivered' ? (ar ? 'تجد تفاصيل التفعيل أدناه. احتفظ بهذه الصفحة.' : 'Your activation details are below. Keep this page for your records.') : (ar ? `استلمنا طلبك ${o.id}. ${PROMISE.title.ar} · ${PROMISE.hours.ar}.` : `We’ve received order ${o.id}. ${PROMISE.title.en} · ${PROMISE.hours.en}.`)}</p>
        <ol className="track" aria-label={ar ? 'حالة الطلب' : 'Order progress'}>
          {steps.map((s, i) => <li key={i} className={i < step ? 'done' : ''} aria-current={i === step - 1 ? 'step' : undefined}><span className="b num" aria-hidden="true">{i < step ? '✓' : i + 1}</span>{s}</li>)}
        </ol>
        {!u ? <p className="note" style={{ marginBottom: 0 }}>{ar ? 'احفظ رابط هذه الصفحة، أو ' : 'Bookmark this page, or '}<Link href={`/${lang}/account?mode=up`} style={{ textDecoration: 'underline' }}>{ar ? 'أنشئ حسابًا' : 'create an account'}</Link>{ar ? ' لترى كل طلباتك في مكان واحد.' : ' to see all your orders in one place.'}</p> : null}
      </section>
    ) : null}
    <div className="two" style={{ marginTop: 18 }}>
      <div className="glass pad">
        <span className="eyebrow">{d.order}</span>
        <h2 style={{ fontSize: 30, margin: '8px 0 6px' }} className="num">{o.id}</h2>
        <p className={`st-${o.status}`} style={{ fontWeight: 600, margin: '0 0 18px' }}>{STATUS[o.status]?.[lang] ?? o.status}</p>
        {o.status === 'paid' && sp.tap_id ? <div className="notice ok" style={{ marginBottom: 16 }}>{d.thanks}</div> : null}
        {o.status === 'pending' && !paymentsEnabled() ? <div className="notice" style={{ marginBottom: 16 }}>{d.payPending}{waLink ? <> <a href={waLink} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">WhatsApp</a></> : null}</div> : null}
        {o.status === 'failed' ? <div className="notice bad" style={{ marginBottom: 16 }}>{d.payFailed} {paymentsEnabled() ? <a href={`/api/pay?o=${o.id}&t=${o.token}`} style={{ textDecoration: 'underline' }}>{d.tryAgain}</a> : null}</div> : null}
        <h3 style={{ margin: '10px 0 8px' }}>{d.delivery}</h3>
        {o.status === 'delivered' && o.delivery ? <><pre className="delivery" dir="auto">{o.delivery}</pre><div style={{ marginTop: 10 }}><CopyButton text={o.delivery} lang={lang} /></div></> : <p className="muted">{d.deliveryWait}</p>}
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
        {waLink ? <a className="btn ghost block" style={{ marginTop: 10 }} href={waLink} target="_blank" rel="noreferrer">{ar ? 'تواصل معنا عبر واتساب' : 'Message us on WhatsApp'}</a> : null}
      </div>
    </div>
    </div>
  );
}

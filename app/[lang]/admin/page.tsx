import Link from 'next/link';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { listOrders, listProducts } from '@/lib/db';
import { paymentsEnabled } from '@/lib/tap';
import { STATUS, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default async function Admin({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ status?: string }> }) {
  const { lang } = await params;
  const { status } = await searchParams;
  await requireAdmin(lang);
  const ar = lang === 'ar';
  const [orders, all, products] = await Promise.all([listOrders({ status, limit: 200 }), listOrders({ limit: 1000 }), listProducts({ all: true })]);
  const since = Date.now() - 30 * 864e5;
  const revenue = all.filter((o) => ['paid', 'delivered'].includes(o.status) && new Date(o.paid_at || o.created_at).getTime() > since).reduce((s, o) => s + o.total, 0);
  const toDeliver = all.filter((o) => o.status === 'paid').length;
  const low = products.filter((p) => p.active && p.plans.some((x) => x.stock <= 2)).length;
  return (
    <div className="wrap" style={{ marginBottom: 70 }}>
      <AdminNav lang={lang} at="orders" />
      {!paymentsEnabled() ? <div className="notice" style={{ marginBottom: 16 }}>{ar ? 'الدفع الإلكتروني غير مفعّل: أضف TAP_SECRET_KEY في إعدادات Vercel. الطلبات الحالية تُدفع يدويًا.' : 'Online payments are off: add TAP_SECRET_KEY in Vercel settings. Orders are paid manually until then.'}</div> : null}
      <div className="perks" style={{ marginBottom: 20 }}>
        <div className="perk glass"><div><p>{ar ? 'بانتظار التسليم' : 'Waiting for delivery'}</p><h3 style={{ fontSize: 28 }} className="num">{toDeliver}</h3></div></div>
        <div className="perk glass"><div><p>{ar ? 'الإيرادات (30 يومًا)' : 'Revenue (30 days)'}</p><h3 style={{ fontSize: 28 }} className="num">{bhd(revenue, lang)}</h3></div></div>
        <div className="perk glass"><div><p>{ar ? 'منتجات بمخزون منخفض' : 'Products low on stock'}</p><h3 style={{ fontSize: 28 }} className="num">{low}</h3></div></div>
      </div>
      <div className="chips" style={{ marginBottom: 14 }}>
        <Link className="chip" aria-current={!status ? 'page' : undefined} href={`/${lang}/admin`}>{ar ? 'الكل' : 'All'}</Link>
        {Object.keys(STATUS).map((k) => <Link key={k} className="chip" aria-current={status === k ? 'page' : undefined} href={`/${lang}/admin?status=${k}`}>{STATUS[k][lang]}</Link>)}
      </div>
      <div className="glass pad tbl">
        {orders.length ? <table>
          <thead><tr><th>{ar ? 'الطلب' : 'Order'}</th><th>{ar ? 'العميل' : 'Customer'}</th><th>{ar ? 'المنتجات' : 'Items'}</th><th>{ar ? 'الإجمالي' : 'Total'}</th><th>{ar ? 'الحالة' : 'Status'}</th><th>{ar ? 'التاريخ' : 'Date'}</th></tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o.id}>
              <td><Link href={`/${lang}/admin/orders/${o.id}`} style={{ textDecoration: 'underline' }} className="num">{o.id}</Link></td>
              <td>{o.name}<div className="faint" style={{ fontSize: 12 }}>{o.phone}</div></td>
              <td>{o.items.map((i) => `${t(i.name, lang)} (${t(i.plan, lang)})${i.qty > 1 ? ' ×' + i.qty : ''}`).join(', ')}</td>
              <td className="num">{bhd(o.total, lang)}</td>
              <td className={`st-${o.status}`}>{STATUS[o.status]?.[lang]}</td>
              <td className="num">{new Date(o.created_at).toLocaleString(ar ? 'ar-BH' : 'en-GB', { timeZone: 'Asia/Bahrain', dateStyle: 'short', timeStyle: 'short' })}</td>
            </tr>))}</tbody>
        </table> : <p className="muted">{ar ? 'لا توجد طلبات.' : 'No orders yet.'}</p>}
      </div>
    </div>
  );
}

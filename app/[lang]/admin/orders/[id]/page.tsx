import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser, isAdmin } from '@/lib/auth';
import { getOrder } from '@/lib/db';
import { STATUS, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { saveOrderAdmin } from '../../actions';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminOrder({ params, searchParams }: { params: Promise<{ lang: Lang; id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { lang, id } = await params;
  const { saved } = await searchParams;
  if (!isAdmin(await currentUser())) notFound();
  const o = await getOrder(id);
  if (!o) notFound();
  const ar = lang === 'ar';
  const wa = o.phone.replace(/\D/g, '');
  const msg = encodeURIComponent(`${ar ? 'مرحبًا' : 'Hi'} ${o.name}, ATOR ${o.id}:\n${o.delivery || ''}`);
  return (
    <div className="wrap" style={{ marginBottom: 70 }}>
      <AdminNav lang={lang} at="orders" />
      <div className="two" style={{ marginTop: 0 }}>
        <form action={saveOrderAdmin} className="glass pad">
          <input type="hidden" name="id" value={o.id} /><input type="hidden" name="lang" value={lang} />
          <h1 style={{ fontSize: 30 }} className="num">{o.id}</h1>
          <p className={`st-${o.status}`} style={{ fontWeight: 600 }}>{STATUS[o.status]?.[lang]}</p>
          {saved ? <div className="notice ok" style={{ margin: '10px 0 16px' }}>{ar ? 'تم الحفظ.' : 'Saved.'}</div> : null}
          <label className="field"><span>{ar ? 'الحالة' : 'Status'}</span>
            <select name="status" defaultValue={o.status}>{Object.keys(STATUS).map((k) => <option key={k} value={k}>{STATUS[k][lang]}</option>)}</select></label>
          <label className="field"><span>{ar ? 'تفاصيل التسليم (يراها العميل عند اختيار «تم التسليم»)' : 'Delivery details (the customer sees this once status is Delivered)'}</span>
            <textarea name="delivery" defaultValue={o.delivery || ''} placeholder={ar ? 'مثال: البريد وكلمة المرور أو كود التفعيل وخطوات الاستخدام' : 'e.g. account email and password, or the activation code and how to use it'} /></label>
          <label className="field"><span>{ar ? 'ملاحظة داخلية' : 'Internal note'}</span><textarea name="admin_note" defaultValue={o.admin_note || ''} style={{ minHeight: 70 }} /></label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn primary">{ar ? 'حفظ' : 'Save'}</button>
            {wa ? <a className="btn ghost" href={`https://wa.me/${wa}?text=${msg}`} target="_blank" rel="noreferrer">{ar ? 'إرسال عبر واتساب' : 'Send on WhatsApp'}</a> : null}
          </div>
        </form>
        <div className="glass pad">
          <h3>{o.name}</h3>
          <p className="muted" style={{ margin: '4px 0 14px' }}>{o.email} · {o.phone}</p>
          {o.items.map((i) => <div className="sumrow" key={i.slug + i.planId}><span>{t(i.name, lang)} · {t(i.plan, lang)} × {i.qty}</span><span className="num">{bhd(i.price * i.qty, lang)}</span></div>)}
          <div className="sumrow big"><span>{ar ? 'الإجمالي' : 'Total'}</span><span className="num">{bhd(o.total, lang)}</span></div>
          <p className="note">{ar ? 'مرجع الدفع' : 'Payment ref'}: {o.payment_ref || '—'} · {o.payment_method || '—'}</p>
          <p className="note"><Link href={`/${lang}/orders/${o.id}?t=${o.token}`} style={{ textDecoration: 'underline' }}>{ar ? 'صفحة العميل' : 'Customer page'}</Link></p>
        </div>
      </div>
    </div>
  );
}

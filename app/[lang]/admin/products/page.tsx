import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser, isAdmin } from '@/lib/auth';
import { listProducts } from '@/lib/db';
import { CATS, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminProducts({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  if (!isAdmin(await currentUser())) notFound();
  const ar = lang === 'ar';
  const products = await listProducts({ all: true });
  return (
    <div className="wrap" style={{ marginBottom: 70 }}>
      <AdminNav lang={lang} at="products" />
      <div className="section-h"><h2>{ar ? 'المنتجات' : 'Products'}</h2><Link className="btn primary" href={`/${lang}/admin/products/new`}>{ar ? '+ منتج جديد' : '+ New product'}</Link></div>
      <div className="glass pad tbl"><table>
        <thead><tr><th /><th>{ar ? 'المنتج' : 'Product'}</th><th>{ar ? 'القسم' : 'Category'}</th><th>{ar ? 'الباقات (السعر · المخزون)' : 'Plans (price · stock)'}</th><th>{ar ? 'الحالة' : 'Status'}</th></tr></thead>
        <tbody>{products.map((p) => (
          <tr key={p.slug}>
            <td style={{ width: 56 }}><img src={p.image} alt="" width={48} height={48} style={{ borderRadius: 8 }} /></td>
            <td><Link href={`/${lang}/admin/products/${p.slug}`} style={{ textDecoration: 'underline', fontWeight: 600 }}>{t(p.name, lang)}</Link><div className="faint" style={{ fontSize: 12 }}>{p.slug}</div></td>
            <td>{CATS[p.cat]?.[lang]}</td>
            <td>{p.plans.length ? p.plans.map((x) => <div key={x.id} className="num">{t(x.label, lang)}: {bhd(x.price, lang)} · <span className={x.stock <= 2 ? 'st-failed' : ''}>{x.stock}</span></div>) : <span className="faint">{ar ? 'لا توجد باقات' : 'No plans yet'}</span>}</td>
            <td>{p.active ? <span className="tag ok">{ar ? 'معروض' : 'Live'}</span> : <span className="tag">{ar ? 'مخفي' : 'Hidden'}</span>}</td>
          </tr>))}</tbody>
      </table></div>
    </div>
  );
}

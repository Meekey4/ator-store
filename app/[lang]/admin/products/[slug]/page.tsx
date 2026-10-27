import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getProduct, type Product } from '@/lib/db';
import { CATS, TYPES, type Lang } from '@/lib/i18n';
import { saveProductAdmin } from '../../actions';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function EditProduct({ params, searchParams }: { params: Promise<{ lang: Lang; slug: string }>; searchParams: Promise<{ saved?: string; e?: string }> }) {
  const { lang, slug } = await params;
  const { saved, e } = await searchParams;
  await requireAdmin(lang);
  const isNew = slug === 'new';
  const p: Product | null = isNew ? null : await getProduct(slug);
  if (!isNew && !p) notFound();
  const ar = lang === 'ar';
  const plans = [...(p?.plans ?? []), ...Array.from({ length: 2 }, () => ({ id: '', label: { en: '', ar: '' }, price: 0, stock: 0 }))];
  const F = ({ name, label, value, wide }: { name: string; label: string; value?: string; wide?: boolean }) =>
    <label className="field" style={wide ? { gridColumn: '1/-1' } : undefined}><span>{label}</span><input name={name} defaultValue={value ?? ''} /></label>;
  return (
    <div className="wrap" style={{ marginBottom: 70 }}>
      <AdminNav lang={lang} at="products" />
      <form action={saveProductAdmin} className="glass pad">
        <input type="hidden" name="lang" value={lang} /><input type="hidden" name="orig" value={isNew ? '' : slug} />
        <div className="section-h"><h2>{isNew ? (ar ? 'منتج جديد' : 'New product') : p!.name[lang]}</h2>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> {ar ? 'معروض في المتجر' : 'Visible in the store'}</label></div>
        {saved ? <div className="notice ok" style={{ marginBottom: 16 }}>{ar ? 'تم الحفظ.' : 'Saved.'}</div> : null}
        {e ? <div className="notice bad" style={{ marginBottom: 16 }}>{e === 'exists' ? (ar ? 'هذا الرابط مستخدم لمنتج آخر.' : 'That URL name is already used by another product.') : (ar ? 'أدخل اسم الرابط.' : 'Enter a URL name.')}</div> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0 16px' }}>
          <F name="name_en" label="Name (English)" value={p?.name.en} />
          <F name="name_ar" label="الاسم (عربي)" value={p?.name.ar} />
          <F name="slug" label={ar ? 'اسم الرابط (a-z, 0-9, -)' : 'URL name (a-z, 0-9, -)'} value={p?.slug} />
          <label className="field"><span>{ar ? 'القسم' : 'Category'}</span><select name="cat" defaultValue={p?.cat ?? 'ent'}>{Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}</select></label>
          <label className="field"><span>{ar ? 'النوع' : 'Type'}</span><select name="type" defaultValue={p?.type ?? 'sub'}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}</select></label>
          <F name="sort" label={ar ? 'الترتيب' : 'Sort order'} value={String(p?.sort ?? 0)} />
          <F name="brief_en" label="Short brief (English)" value={p?.brief.en} wide />
          <F name="brief_ar" label="وصف مختصر (عربي)" value={p?.brief.ar} wide />
          <label className="field" style={{ gridColumn: '1/-1' }}><span>Description (English)</span><textarea name="desc_en" defaultValue={p?.desc?.en ?? ''} /></label>
          <label className="field" style={{ gridColumn: '1/-1' }}><span>الوصف (عربي)</span><textarea name="desc_ar" defaultValue={p?.desc?.ar ?? ''} /></label>
          <F name="image" label={ar ? 'رابط الصورة' : 'Image URL'} value={p?.image} wide />
        </div>
        <h3 style={{ margin: '10px 0 6px' }}>{ar ? 'الباقات' : 'Plans'}</h3>
        <p className="note" style={{ marginTop: 0 }}>{ar ? 'اترك الرمز فارغًا لحذف الباقة. السعر بالدينار (مثال 2.500).' : 'Clear the code to remove a plan. Price in BHD (e.g. 2.500).'}</p>
        <div className="plan-edit faint" style={{ fontSize: 12 }}><span>{ar ? 'الرمز' : 'Code'}</span><span>Label (EN)</span><span>الاسم (AR)</span><span>{ar ? 'السعر د.ب' : 'Price BD'}</span><span>{ar ? 'المخزون' : 'Stock'}</span><span /></div>
        {plans.map((x, i) => (
          <div className="plan-edit" key={i}>
            <input name="plan_id" defaultValue={x.id} placeholder="1m" aria-label="Plan code" />
            <input name="plan_en" defaultValue={x.label.en} placeholder="1 month" aria-label="Label EN" />
            <input name="plan_ar" defaultValue={x.label.ar} placeholder="شهر واحد" aria-label="Label AR" dir="rtl" />
            <input name="plan_price" defaultValue={x.price ? (x.price / 1000).toFixed(3) : ''} inputMode="decimal" placeholder="1.000" aria-label="Price" />
            <input name="plan_stock" defaultValue={x.id ? String(x.stock) : ''} inputMode="numeric" placeholder="0" aria-label="Stock" />
            <span />
          </div>
        ))}
        <button className="btn primary" style={{ marginTop: 16 }}>{ar ? 'حفظ المنتج' : 'Save product'}</button>
      </form>
    </div>
  );
}

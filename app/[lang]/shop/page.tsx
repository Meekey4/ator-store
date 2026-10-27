import Link from 'next/link';
import type { Metadata } from 'next';
import { SearchBox } from '@/components/SearchBox';
import { listProducts } from '@/lib/db';
import { CATS, dict, t, type Lang } from '@/lib/i18n';
import { ProductCard, fromPrice, inStock } from '@/components/ProductCard';
import { Crumbs } from '@/components/Seo';
import { Remembered } from '@/components/Remembered';
import { DESC } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ cat?: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const { cat = '' } = await searchParams;
  const c = CATS[cat];
  const ar = lang === 'ar';
  return {
    title: c ? (ar ? `${c.ar} · اشتراكات في البحرين` : `${c.en} subscriptions in Bahrain`) : (ar ? 'كل المنتجات' : 'All products'),
    description: c ? (ar ? `تسوّق ${c.ar} من ATOR بالدينار البحريني مع تسليم فوري.` : `Shop ${c.en.toLowerCase()} from ATOR, priced in BHD with instant delivery in Bahrain.`) : DESC.shop[lang],
    alternates: { canonical: `/${lang}/shop${c ? `?cat=${cat}` : ''}` },
  };
}

const SORTS = { pop: { en: 'Most popular', ar: 'الأكثر طلبًا' }, low: { en: 'Price: low to high', ar: 'السعر: من الأقل' }, high: { en: 'Price: high to low', ar: 'السعر: من الأعلى' }, az: { en: 'Name A–Z', ar: 'الاسم أ–ي' } } as const;

export default async function Shop({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ cat?: string; q?: string; sort?: string; stock?: string }> }) {
  const { lang } = await params;
  const { cat = '', q = '', sort = 'pop', stock = '' } = await searchParams;
  const d = dict(lang);
  const ar = lang === 'ar';
  const all = await listProducts();
  const needle = q.trim().toLowerCase();
  const price = (p: (typeof all)[number]) => fromPrice(p) ?? Number.MAX_SAFE_INTEGER;
  const list = all
    .filter((p) => (!cat || p.cat === cat) && (!stock || inStock(p)) && (!needle || `${p.name.en} ${p.name.ar} ${p.brief.en} ${p.brief.ar}`.toLowerCase().includes(needle)))
    .sort((a, b) => sort === 'low' ? price(a) - price(b) : sort === 'high' ? (fromPrice(b) ?? -1) - (fromPrice(a) ?? -1) : sort === 'az' ? t(a.name, lang).localeCompare(t(b.name, lang)) : Number(inStock(b)) - Number(inStock(a)) || a.sort - b.sort);
  const qs = (o: Record<string, string>) => { const u = new URLSearchParams({ ...(cat ? { cat } : {}), ...(q ? { q } : {}), ...(sort !== 'pop' ? { sort } : {}), ...(stock ? { stock } : {}), ...o }); [...u.entries()].forEach(([k, v]) => { if (!v) u.delete(k); }); const s = u.toString(); return `/${lang}/shop${s ? '?' + s : ''}`; };
  return (
    <div className="wrap">
      <Crumbs items={[{ name: 'ATOR', href: `/${lang}` }, ...(cat && CATS[cat] ? [{ name: d.shop, href: `/${lang}/shop` }, { name: CATS[cat][lang] }] : [{ name: d.shop }])]} />
      <div className="section-h" style={{ marginTop: 6 }}>
        <h1 style={{ fontSize: 'clamp(30px,4vw,44px)' }}>{cat && CATS[cat] ? CATS[cat][lang] : d.allProducts}</h1>
        <form action={`/${lang}/shop`} className="shop-tools" role="search">
          {cat ? <input type="hidden" name="cat" value={cat} /> : null}
          <label className="sr-only" htmlFor="shop-q">{d.search}</label>
          <SearchBox lang={lang} defaultValue={q} placeholder={`${d.search}  ( / )`} items={all.map((p) => ({ slug: p.slug, name: t(p.name, lang), alt: t(p.name, lang === 'ar' ? 'en' : 'ar'), cat: CATS[p.cat]?.[lang] || '', image: p.image || '', price: fromPrice(p) }))} />
          <label className="sr-only" htmlFor="shop-sort">{ar ? 'الترتيب' : 'Sort by'}</label>
          <select id="shop-sort" name="sort" defaultValue={sort} data-autosubmit>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}
          </select>
          <label className="check"><input type="checkbox" name="stock" value="1" defaultChecked={!!stock} data-autosubmit /> {ar ? 'المتوفر فقط' : 'In stock only'}</label>
          <button className="btn ghost sm">{ar ? 'تطبيق' : 'Apply'}</button>
        </form>
      </div>
      <div className="chips" style={{ marginBottom: 24 }}>
        <Link className="chip" href={qs({ cat: '' })} aria-current={!cat ? 'page' : undefined}>{d.allProducts}</Link>
        {Object.entries(CATS).map(([k, v]) => <Link key={k} className="chip" aria-current={cat === k ? 'page' : undefined} href={qs({ cat: k })}>{v[lang]}</Link>)}
      </div>
      <p className="muted" aria-live="polite" style={{ margin: '0 0 14px' }}>{ar ? `${list.length} منتج` : `${list.length} product${list.length === 1 ? '' : 's'}`}{needle ? (ar ? ` لـ «${q}»` : ` for “${q}”`) : ''}</p>
      {list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div>
        : <div className="glass pad" style={{ textAlign: 'center' }}><p className="muted" style={{ marginTop: 0 }}>{ar ? 'لا توجد منتجات مطابقة.' : 'No products match.'}</p><Link className="btn ghost" href={`/${lang}/shop`}>{d.allProducts}</Link></div>}
      <Remembered lang={lang} products={all.map((p) => ({ slug: p.slug, name: p.name[lang], image: p.image || '', price: fromPrice(p) }))} />
    </div>
  );
}

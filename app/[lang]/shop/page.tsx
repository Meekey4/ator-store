import Link from 'next/link';
import type { Metadata } from 'next';
import { listProducts } from '@/lib/db';
import { CATS, dict, t, type Lang } from '@/lib/i18n';
import { ProductCard, inStock } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop' };

export default async function Shop({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ cat?: string; q?: string }> }) {
  const { lang } = await params;
  const { cat = '', q = '' } = await searchParams;
  const d = dict(lang);
  const all = await listProducts();
  const needle = q.trim().toLowerCase();
  const list = all
    .filter((p) => (!cat || p.cat === cat) && (!needle || `${p.name.en} ${p.name.ar} ${t(p.brief, lang)}`.toLowerCase().includes(needle)))
    .sort((a, b) => Number(inStock(b)) - Number(inStock(a)) || a.sort - b.sort);
  return (
    <div className="wrap">
      <div className="section-h" style={{ marginTop: 36 }}>
        <h1 style={{ fontSize: 'clamp(30px,4vw,44px)' }}>{cat && CATS[cat] ? CATS[cat][lang] : d.allProducts}</h1>
        <form action={`/${lang}/shop`} style={{ display: 'flex', gap: 8 }}>
          {cat ? <input type="hidden" name="cat" value={cat} /> : null}
          <label className="field" style={{ margin: 0 }}><span className="sr" hidden>{d.search}</span>
            <input name="q" defaultValue={q} placeholder={d.search} aria-label={d.search} style={{ minWidth: 220 }} /></label>
        </form>
      </div>
      <div className="chips" style={{ marginBottom: 24 }}>
        <Link className="chip" href={`/${lang}/shop`} aria-current={!cat ? 'page' : undefined}>{d.allProducts}</Link>
        {Object.entries(CATS).map(([k, v]) => <Link key={k} className="chip" aria-current={cat === k ? 'page' : undefined} href={`/${lang}/shop?cat=${k}`}>{v[lang]}</Link>)}
      </div>
      {list.length ? <div className="grid section">{list.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div>
        : <p className="muted section">{lang === 'ar' ? 'لا توجد منتجات مطابقة.' : 'No products match.'}</p>}
    </div>
  );
}

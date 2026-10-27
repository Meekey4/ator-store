import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, listProducts } from '@/lib/db';
import { CATS, TYPES, dict, t, type Lang } from '@/lib/i18n';
import { PlanPicker } from '@/components/PlanPicker';
import { ProductCard, inStock } from '@/components/ProductCard';
import { Crumbs, JsonLd } from '@/components/Seo';
import { ProductTools } from '@/components/ProductTools';
import { PROMISE, SITE } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = await getProduct(slug);
  if (!p || !p.active) return { title: lang === 'ar' ? 'غير موجود' : 'Not found', robots: { index: false } };
  const name = t(p.name, lang);
  const from = p.plans.length ? Math.min(...p.plans.map((x) => x.price)) / 1000 : null;
  const description = `${t(p.brief, lang)} ${from != null ? (lang === 'ar' ? `من ${from.toFixed(3)} د.ب.` : `From BD ${from.toFixed(3)}.`) : ''} ${PROMISE.title[lang]}.`.trim();
  return {
    title: lang === 'ar' ? `${name} في البحرين` : `${name} in Bahrain`,
    description,
    alternates: { canonical: `/${lang}/p/${slug}`, languages: { en: `/en/p/${slug}`, ar: `/ar/p/${slug}` } },
    openGraph: { title: name, description, url: `/${lang}/p/${slug}`, images: [{ url: p.image || '/brand/og.png', width: 900, height: 900, alt: name }] },
    twitter: { card: 'summary_large_image', title: name, description, images: [p.image || '/brand/og.png'] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const p = await getProduct(slug);
  if (!p || !p.active) notFound();
  const d = dict(lang);
  const name = t(p.name, lang);
  const all = await listProducts();
  const related = all.filter((x) => x.slug !== p.slug && x.cat === p.cat && inStock(x))
    .concat(all.filter((x) => x.slug !== p.slug && x.cat !== p.cat && inStock(x))).slice(0, 4);
  const prices = p.plans.map((x) => x.price / 1000);
  return (
    <div className="wrap pdp-wrap">
      <Crumbs items={[{ name: 'ATOR', href: `/${lang}` }, { name: d.shop, href: `/${lang}/shop` }, { name: CATS[p.cat]?.[lang] ?? '', href: `/${lang}/shop?cat=${p.cat}` }, { name }]} />
      <div className="pdp">
        <div className="media glass"><img src={p.image} alt={`${name}: ${t(p.brief, lang)}`} width={900} height={900} /></div>
        <div>
          <span className="eyebrow">{TYPES[p.type]?.[lang]}</span>
          <h1 style={{ marginTop: 10 }}>{name}</h1>
          <p className="lead">{t(p.desc, lang) || t(p.brief, lang)}</p>
          <PlanPicker lang={lang} slug={p.slug} name={name} plans={p.plans.map((x) => ({ id: x.id, label: t(x.label, lang), price: x.price, stock: x.stock }))} />
          <p className="promise" style={{ marginTop: 18 }}><span className="dot" aria-hidden="true" />{PROMISE.title[lang]} · {PROMISE.hours[lang]}</p>
          <ul className="facts">
            <li><strong>{d.secure}</strong> · {d.secureSub}</li>
            <li><strong>{d.local}</strong> · {d.localSub}</li>
            <li><Link href={`/${lang}/info/refunds`}>{d.refunds}</Link> · <Link href={`/${lang}/info/faq`}>{d.faq}</Link></li>
          </ul>
          <ProductTools lang={lang} slug={p.slug} name={name} />
        </div>
      </div>
      {related.length ? (
        <section className="section">
          <div className="section-h"><h2>{lang === 'ar' ? 'قد يعجبك أيضًا' : 'You may also like'}</h2><Link href={`/${lang}/shop?cat=${p.cat}`} className="muted">{lang === 'ar' ? `كل ${CATS[p.cat]?.ar} ←` : `All ${CATS[p.cat]?.en} →`}</Link></div>
          <div className="grid">{related.map((x) => <ProductCard key={x.slug} p={x} lang={lang} />)}</div>
        </section>
      ) : null}
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Product', name, description: t(p.desc, lang) || t(p.brief, lang), image: SITE + p.image, sku: p.slug,
        brand: { '@type': 'Brand', name: p.name.en.split(' ')[0] }, category: CATS[p.cat]?.en,
        ...(prices.length ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'BHD', lowPrice: Math.min(...prices).toFixed(3), highPrice: Math.max(...prices).toFixed(3), offerCount: prices.length,
          availability: inStock(p) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${SITE}/${lang}/p/${p.slug}`, seller: { '@id': SITE + '/#store' } } } : {}),
      }} />
    </div>
  );
}

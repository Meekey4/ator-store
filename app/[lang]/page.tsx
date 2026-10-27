import Link from 'next/link';
import { listProducts } from '@/lib/db';
import { CATS, dict, type Lang } from '@/lib/i18n';
import { ProductCard, inStock } from '@/components/ProductCard';
import { Faq } from '@/components/Faq';
import { Remembered } from '@/components/Remembered';
import { fromPrice } from '@/components/ProductCard';
import { PROMISE, STEPS, WHATSAPP } from '@/lib/content';
import { Marquee, NumberTicker, WordRotate } from '@/components/Magic';

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const d = dict(lang);
  const products = await listProducts();
  const featured = [...products].sort((a, b) => Number(inStock(b)) - Number(inStock(a)) || a.sort - b.sort).slice(0, 8);
  const heroPics = products.filter(inStock).slice(0, 2);
  const live = products.filter(inStock);
  const rotate = (live.length ? live : products).slice(0, 8).map((p) => p.name[lang]);
  const pics = products.filter((p) => p.image);
  // Repeat short lists so each strip is always wider than the screen.
  const fill = <T,>(a: T[], n: number) => (a.length ? Array.from({ length: Math.max(n, a.length) }, (_, i) => a[i % a.length]) : a);
  const half = Math.ceil(pics.length / 2);
  const rowA = fill(pics.slice(0, half), 9), rowB = fill(pics.length > 1 ? pics.slice(half) : pics, 9);
  const ar = lang === 'ar';
  const Tile = ({ p }: { p: (typeof products)[number] }) => (
    <Link className="mq-item" href={`/${lang}/p/${p.slug}`}><img src={p.image} alt="" width={56} height={56} loading="lazy" /><span>{p.name[lang]}</span></Link>
  );
  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <span className="eyebrow">ATOR · {lang === 'ar' ? 'البحرين' : 'Bahrain'}</span>
          <h1 style={{ marginTop: 12 }}>{d.heroTitle}</h1>
          <p>{d.heroSub}</p>
          {rotate.length ? <div className="rotline">{ar ? 'احصل على' : 'Get'} <WordRotate words={rotate} /> {ar ? 'خلال دقائق' : 'in minutes'}</div> : null}
          <div className="cta">
            <Link className="btn primary shimmer" href={`/${lang}/shop`}>{d.shopNow}</Link>
            <a className="btn ghost" href="#cats">{d.browse}</a>
          </div>
          <ul className="stats">
            <li><b><NumberTicker value={products.length} /></b><span>{ar ? 'خدمة رقمية' : 'digital services'}</span></li>
            <li><b><NumberTicker value={Object.keys(CATS).length} /></b><span>{ar ? 'أقسام' : 'categories'}</span></li>
            <li><b><NumberTicker value={2} /></b><span>{ar ? 'طرق دفع' : 'ways to pay'}</span></li>
          </ul>
          <p className="promise"><span className="dot" aria-hidden="true" />{PROMISE.title[lang]} · {PROMISE.hours[lang]}</p>
        </div>
        <div className="hero-art">
          {heroPics.map((p) => <img key={p.slug} src={p.image} alt={`${p.name[lang]} — ATOR`} width={600} height={600} />)}
        </div>
      </section>

      <div className="perks">
        {[
          [d.instant, d.instantSub, <path key="a" d="M13 2 4 14h7l-1 8 9-12h-7z" />],
          [d.secure, d.secureSub, <g key="b"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></g>],
          [d.local, d.localSub, <path key="c" d="M4 5h16v11H9l-5 4z" />],
        ].map(([h, s, ic], i) => (
          <div className="perk glass" key={i}>
            <span className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">{ic}</svg></span>
            <div><h3>{h}</h3><p>{s}</p></div>
          </div>
        ))}
      </div>

      {pics.length > 1 ? (
        <section className="section mq-wrap" aria-label={ar ? 'الخدمات المتوفرة' : 'Services we sell'}>
          <Marquee seconds={45} label={ar ? 'خدمات ATOR' : 'ATOR services'}>{rowA.map((p, i) => <Tile key={i} p={p} />)}</Marquee>
          <Marquee seconds={52} reverse>{rowB.map((p, i) => <Tile key={i} p={p} />)}</Marquee>
        </section>
      ) : null}

      <section className="section" id="cats">
        <div className="section-h"><h2>{d.browse}</h2></div>
        <div className="chips">
          <Link className="chip" href={`/${lang}/shop`}>{d.allProducts}</Link>
          {Object.entries(CATS).map(([k, v]) => <Link key={k} className="chip" href={`/${lang}/shop?cat=${k}`}>{v[lang]}</Link>)}
        </div>
      </section>

      <section className="section">
        <div className="section-h"><h2>{d.featured}</h2><Link href={`/${lang}/shop`} className="muted">{d.allProducts} →</Link></div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div>
      </section>

      <Remembered lang={lang} products={products.map((p) => ({ slug: p.slug, name: p.name[lang], image: p.image || '', price: fromPrice(p) }))} />

      <section className="section" id="how">
        <div className="section-h"><h2>{lang === 'ar' ? 'كيف يعمل' : 'How it works'}</h2></div>
        <ol className="steps">
          {STEPS.map((st, i) => (
            <li key={i} className={`glass${i === STEPS.length - 1 ? ' beam' : ''}`}><span className="n num">{i + 1}</span><h3>{st.title[lang]}</h3><p>{st.body[lang]}</p></li>
          ))}
        </ol>
        <p className="muted" style={{ marginTop: 14 }}>{PROMISE.after[lang]}</p>
      </section>

      <section className="section" id="faq">
        <div className="section-h"><h2>{d.faq}</h2><Link href={`/${lang}/info/faq`} className="muted">{lang === 'ar' ? 'كل الأسئلة ←' : 'All questions →'}</Link></div>
        <Faq lang={lang} />
      </section>

      <div className="mcta" role="region" aria-label={d.shopNow}>
        <Link className="btn primary shimmer" href={`/${lang}/shop`}>{d.shopNow}</Link>
        {WHATSAPP ? <a className="btn ghost" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a> : <Link className="btn ghost" href={`/${lang}/info/faq`}>{d.faq}</Link>}
      </div>
    </div>
  );
}

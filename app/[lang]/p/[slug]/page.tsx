import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct } from '@/lib/db';
import { CATS, TYPES, dict, t, type Lang } from '@/lib/i18n';
import { PlanPicker } from '@/components/PlanPicker';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = await getProduct(slug);
  return p ? { title: t(p.name, lang), description: t(p.brief, lang), openGraph: { images: [p.image || ''] } } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const p = await getProduct(slug);
  if (!p || !p.active) notFound();
  const d = dict(lang);
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/${lang}`}>ATOR</Link><span>/</span>
        <Link href={`/${lang}/shop?cat=${p.cat}`}>{CATS[p.cat]?.[lang]}</Link><span>/</span>
        <span>{t(p.name, lang)}</span>
      </nav>
      <div className="pdp">
        <div className="media glass"><img src={p.image} alt={t(p.name, lang)} width={900} height={900} /></div>
        <div>
          <span className="eyebrow">{TYPES[p.type]?.[lang]}</span>
          <h1 style={{ marginTop: 10 }}>{t(p.name, lang)}</h1>
          <p className="lead">{t(p.desc, lang) || t(p.brief, lang)}</p>
          <PlanPicker lang={lang} slug={p.slug} name={t(p.name, lang)} plans={p.plans.map((x) => ({ id: x.id, label: t(x.label, lang), price: x.price, stock: x.stock }))} />
          <div className="facts">
            <div>⚡ {d.instant} · {d.instantSub}</div>
            <div>🔒 {d.secure} · {d.secureSub}</div>
            <div>💬 {d.local} · {d.localSub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

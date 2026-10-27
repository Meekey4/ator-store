import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { INFO, dict, type Lang } from '@/lib/i18n';
import { BUSINESS, FAQS, WHATSAPP } from '@/lib/content';
import { Crumbs, JsonLd } from '@/components/Seo';
import { FaqSearch } from '@/components/FaqSearch';

const PAGES = ['faq', 'terms', 'refunds', 'privacy', 'cookies'] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; page: string }> }): Promise<Metadata> {
  const { lang, page } = await params;
  const p = INFO[page];
  if (!p) return {};
  const description = p.body[lang].split('\n')[0].slice(0, 155);
  return { title: p.title[lang], description, alternates: { canonical: `/${lang}/info/${page}`, languages: { en: `/en/info/${page}`, ar: `/ar/info/${page}` } } };
}

export default async function Info({ params }: { params: Promise<{ lang: Lang; page: string }> }) {
  const { lang, page } = await params;
  const p = INFO[page];
  if (!p) notFound();
  const d = dict(lang);
  const ar = lang === 'ar';
  const labels: Record<string, string> = { faq: d.faq, terms: d.terms, refunds: d.refunds, privacy: d.privacy, cookies: d.cookies };
  return (
    <div className="wrap" style={{ maxWidth: 780 }}>
      <Crumbs items={[{ name: 'ATOR', href: `/${lang}` }, { name: p.title[lang] }]} />
      <h1 style={{ fontSize: 'clamp(30px,4vw,42px)', marginBottom: 20 }}>{p.title[lang]}</h1>
      {page === 'faq' ? (
        <>
          <FaqSearch lang={lang} />
          <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })) }} />
        </>
      ) : (
        <div className="glass pad prose">
          {p.body[lang].split('\n').map((para, i) => {
            const m = para.match(/^([^:：]{2,40})[:：]\s*(.*)$/);
            return <p key={i}>{m ? <><strong>{m[1]}:</strong> {m[2]}</> : para}</p>;
          })}
          {page === 'terms' ? (
            <p><strong>{ar ? 'بيانات المتجر:' : 'Seller:'}</strong> {BUSINESS.name}{BUSINESS.cr ? ` · ${ar ? 'سجل تجاري' : 'CR'} ${BUSINESS.cr}` : ''}{BUSINESS.address ? ` · ${BUSINESS.address}` : ` · ${ar ? 'مملكة البحرين' : 'Kingdom of Bahrain'}`}{BUSINESS.email ? ` · ${BUSINESS.email}` : ''}{WHATSAPP ? ` · WhatsApp +${WHATSAPP}` : ''}. {ar ? 'تخضع هذه الشروط لقوانين مملكة البحرين.' : 'These terms are governed by the laws of the Kingdom of Bahrain.'}</p>
          ) : null}
        </div>
      )}
      <nav className="related-links" aria-label={ar ? 'صفحات أخرى' : 'Other pages'}>
        {PAGES.filter((x) => x !== page).map((x) => <Link key={x} className="chip" href={`/${lang}/info/${x}`}>{labels[x]}</Link>)}
        <Link className="chip" href={`/${lang}/shop`}>{d.allProducts}</Link>
      </nav>
    </div>
  );
}

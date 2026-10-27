import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { CartProvider } from '@/components/Cart';
import { Header, Footer } from '@/components/Chrome';
import { dir, isLang, dict, LANGS } from '@/lib/i18n';
import { DESC, SITE, WHATSAPP } from '@/lib/content';
import { JsonLd } from '@/components/Seo';
import { Analytics } from '@/components/Analytics';
import { SiteTools } from '@/components/SiteTools';
import { Flash } from '@/components/Flash';
import { Motion } from '@/components/Motion';
import { prefsScript } from '@/components/Prefs';
import { Suspense } from 'react';

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export const viewport: Viewport = { themeColor: '#070808', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = isLang(lang) ? lang : 'en';
  const ar = l === 'ar';
  const title = ar ? 'ATOR · اشتراكات رقمية في البحرين' : 'ATOR · Digital subscriptions in Bahrain';
  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: '%s · ATOR' },
    description: DESC.home[l],
    icons: { icon: '/brand/ator-symbol.svg' },
    alternates: { canonical: `/${l}`, languages: { en: '/en', ar: '/ar', 'x-default': '/en' } },
    openGraph: { type: 'website', siteName: 'ATOR', locale: ar ? 'ar_BH' : 'en_BH', title, description: DESC.home[l], url: `/${l}`, images: [{ url: '/brand/og.png', width: 1200, height: 630, alt: 'ATOR' }] },
    twitter: { card: 'summary_large_image', title, description: DESC.home[l], images: ['/brand/og.png'] },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dir(lang)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/brand/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Rubik:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        <JsonLd data={{
          '@context': 'https://schema.org', '@type': 'OnlineStore', '@id': SITE + '/#store', name: 'ATOR', url: SITE + '/' + lang,
          logo: SITE + '/brand/ator-logo-white.svg', image: SITE + '/brand/og.png', description: DESC.home[lang],
          areaServed: { '@type': 'Country', name: 'Bahrain' }, address: { '@type': 'PostalAddress', addressCountry: 'BH' },
          currenciesAccepted: 'BHD', paymentAccepted: 'BenefitPay, Credit card, Debit card', availableLanguage: ['en', 'ar'],
          ...(WHATSAPP ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', telephone: '+' + WHATSAPP, availableLanguage: ['en', 'ar'] } } : {}),
        }} />
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'ATOR', url: SITE + '/' + lang, inLanguage: lang, potentialAction: { '@type': 'SearchAction', target: `${SITE}/${lang}/shop?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }} />
        <CartProvider>
          <a className="skip" href="#main">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a>
          <Header lang={lang} />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer lang={lang} />
          <Suspense fallback={null}><Flash lang={lang} /><Motion /></Suspense>
        </CartProvider>
        <SiteTools lang={lang} />
        <Analytics lang={lang} />
      </body>
    </html>
  );
}

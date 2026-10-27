import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { CartProvider } from '@/components/Cart';
import { Header, Footer } from '@/components/Chrome';
import { dir, isLang, dict, LANGS } from '@/lib/i18n';

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export const viewport: Viewport = { themeColor: '#070808', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = isLang(lang) ? lang : 'en';
  return {
    title: { default: 'ATOR · Digital subscriptions in Bahrain', template: '%s · ATOR' },
    description: dict(l).tagline,
    icons: { icon: '/brand/ator-symbol.svg' },
    alternates: { languages: { en: '/en', ar: '/ar' } },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Rubik:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        <CartProvider>
          <Header lang={lang} />
          <main>{children}</main>
          <Footer lang={lang} />
        </CartProvider>
      </body>
    </html>
  );
}

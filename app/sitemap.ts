import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/db';
import { SITE } from '@/lib/content';
import { CATS } from '@/lib/i18n';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const paths = ['', '/shop', ...Object.keys(CATS).map((c) => `/shop?cat=${c}`), ...products.map((p) => `/p/${p.slug}`), ...['faq', 'terms', 'refunds', 'privacy', 'cookies'].map((x) => `/info/${x}`)];
  return paths.map((p) => ({ url: `${SITE}/en${p}`, alternates: { languages: { en: `${SITE}/en${p}`, ar: `${SITE}/ar${p}` } }, changeFrequency: p.startsWith('/p/') ? 'weekly' : 'monthly', priority: p === '' ? 1 : p.startsWith('/p/') ? 0.8 : 0.5 }));
}

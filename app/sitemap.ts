import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://ator.bh';
  const products = await listProducts();
  return ['en', 'ar'].flatMap((l) => [`/${l}`, `/${l}/shop`, ...products.map((p) => `/${l}/p/${p.slug}`)]).map((u) => ({ url: site + u }));
}

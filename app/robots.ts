import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/en/admin', '/ar/admin', '/en/account', '/ar/account', '/en/orders', '/ar/orders', '/en/cart', '/ar/cart', '/en/checkout', '/ar/checkout'] }], sitemap: `${SITE}/sitemap.xml`, host: SITE };
}

import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/en/admin', '/ar/admin', '/en/account', '/ar/account', '/en/orders', '/ar/orders'] }], sitemap: site ? `${site}/sitemap.xml` : undefined };
}

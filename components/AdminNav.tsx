import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

export function AdminNav({ lang, at }: { lang: Lang; at: string }) {
  const ar = lang === 'ar';
  return (
    <nav className="admin-nav chips">
      <Link className="chip" aria-current={at === 'orders' ? 'page' : undefined} href={`/${lang}/admin`}>{ar ? 'الطلبات' : 'Orders'}</Link>
      <Link className="chip" aria-current={at === 'products' ? 'page' : undefined} href={`/${lang}/admin/products`}>{ar ? 'المنتجات والمخزون' : 'Products & stock'}</Link>
    </nav>
  );
}

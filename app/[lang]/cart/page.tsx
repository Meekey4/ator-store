import type { Metadata } from 'next';
import { DESC } from '@/lib/content';
import { listProducts } from '@/lib/db';
import { t, type Lang } from '@/lib/i18n';
import { CartView } from '@/components/CartView';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> { const { lang } = await params; return { title: lang === 'ar' ? 'سلة التسوق' : 'Your cart', description: DESC.cart[lang], robots: { index: false } }; }

export default async function CartPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const products = await listProducts();
  const info = Object.fromEntries(products.map((p) => [p.slug, { name: t(p.name, lang), image: p.image || '', plans: Object.fromEntries(p.plans.map((x) => [x.id, { label: t(x.label, lang), price: x.price, stock: x.stock }])) }]));
  return <CartView lang={lang} info={info} mode="cart" />;
}

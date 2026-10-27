import type { Metadata } from 'next';
import { DESC } from '@/lib/content';
import { listProducts } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { t, type Lang } from '@/lib/i18n';
import { CartView } from '@/components/CartView';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> { const { lang } = await params; return { title: lang === 'ar' ? 'إتمام الطلب' : 'Checkout', description: DESC.checkout[lang], robots: { index: false } }; }

export default async function CheckoutPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const [products, u] = await Promise.all([listProducts(), currentUser()]);
  const info = Object.fromEntries(products.map((p) => [p.slug, { name: t(p.name, lang), image: p.image || '', plans: Object.fromEntries(p.plans.map((x) => [x.id, { label: t(x.label, lang), price: x.price, stock: x.stock }])) }]));
  return <CartView lang={lang} info={info} mode="checkout" me={u ? { name: u.name, email: u.email, phone: u.phone } : null} />;
}

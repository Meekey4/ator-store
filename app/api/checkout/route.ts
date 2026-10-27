import { NextResponse } from 'next/server';
import { createOrder, getProduct, updateOrder, type OrderItem } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { createCharge, paymentsEnabled } from '@/lib/tap';
import { baseUrl } from '@/lib/site';
import { isLang } from '@/lib/i18n';

type Body = { lang?: string; name?: string; email?: string; phone?: string; items?: { slug: string; planId: string; qty: number }[] };

export async function POST(req: Request) {
  let b: Body;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
  const lang = isLang(b.lang || '') ? (b.lang as 'en' | 'ar') : 'en';
  const ar = lang === 'ar';
  const name = String(b.name || '').trim().slice(0, 80);
  const email = String(b.email || '').trim().toLowerCase().slice(0, 120);
  const phone = String(b.phone || '').trim().slice(0, 30);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, '').length < 8)
    return NextResponse.json({ error: ar ? 'تحقق من الاسم والبريد ورقم الهاتف.' : 'Check your name, email and phone number.' }, { status: 400 });
  const req_ = (b.items || []).slice(0, 20);
  if (!req_.length) return NextResponse.json({ error: ar ? 'السلة فارغة.' : 'Your cart is empty.' }, { status: 400 });

  // Re-price everything on the server; never trust prices from the browser.
  const items: OrderItem[] = [];
  for (const it of req_) {
    const p = await getProduct(String(it.slug));
    const plan = p?.plans.find((x) => x.id === it.planId);
    const qty = Math.max(1, Math.min(10, Math.floor(Number(it.qty) || 1)));
    if (!p || !p.active || !plan) return NextResponse.json({ error: ar ? 'أحد المنتجات لم يعد متوفرًا.' : 'One of the products is no longer available.' }, { status: 409 });
    if (plan.stock < qty) return NextResponse.json({ error: ar ? `الكمية المتوفرة من ${p.name.ar} غير كافية.` : `Not enough stock for ${p.name.en}.` }, { status: 409 });
    items.push({ slug: p.slug, planId: plan.id, name: p.name, plan: plan.label, price: plan.price, qty });
  }
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const u = await currentUser();
  const order = await createOrder({ user_id: u?.id ?? null, email, name, phone, lang, items, total });
  const base = await baseUrl();
  const orderUrl = `${base}/${lang}/orders/${order.id}?t=${order.token}`;

  if (!paymentsEnabled()) return NextResponse.json({ redirect: orderUrl, order: order.id });
  try {
    const ch = await createCharge(order, base);
    await updateOrder(order.id, { payment_ref: ch.id });
    return NextResponse.json({ redirect: ch.url, order: order.id });
  } catch (e) {
    await updateOrder(order.id, { status: 'failed', admin_note: `Charge error: ${(e as Error).message}` });
    return NextResponse.json({ redirect: orderUrl, order: order.id });
  }
}

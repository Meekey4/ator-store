import { NextResponse } from 'next/server';
import { getOrder, updateOrder } from '@/lib/db';
import { createCharge, paymentsEnabled } from '@/lib/tap';
import { baseUrl } from '@/lib/site';

// Retry payment for an unpaid order: /api/pay?o=AT-123456&t=<token>
export async function GET(req: Request) {
  const u = new URL(req.url);
  const o = await getOrder(u.searchParams.get('o') || '');
  const base = await baseUrl();
  if (!o || o.token !== u.searchParams.get('t')) return NextResponse.redirect(`${base}/`, 303);
  const back = `${base}/${o.lang}/orders/${o.id}?t=${o.token}`;
  if (!paymentsEnabled() || !['pending', 'failed'].includes(o.status)) return NextResponse.redirect(back, 303);
  try {
    const ch = await createCharge(o, base);
    await updateOrder(o.id, { status: 'pending', payment_ref: ch.id });
    return NextResponse.redirect(ch.url, 303);
  } catch { return NextResponse.redirect(back, 303); }
}

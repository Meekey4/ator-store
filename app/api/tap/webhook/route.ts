import { NextResponse } from 'next/server';
import { getCharge } from '@/lib/tap';
import { getOrder, markPaid, updateOrder } from '@/lib/db';

// Tap posts the charge here. We never trust the body: the charge is re-read from Tap's API by id.
export async function POST(req: Request) {
  let id = '';
  try { id = String((await req.json())?.id || ''); } catch {}
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const ch = await getCharge(id);
  if (!ch?.order) return NextResponse.json({ ok: false }, { status: 404 });
  const o = await getOrder(ch.order);
  if (!o) return NextResponse.json({ ok: false }, { status: 404 });
  if (ch.status === 'CAPTURED') await markPaid(o.id, ch.id, ch.method);
  else if (['FAILED', 'DECLINED', 'CANCELLED', 'ABANDONED', 'TIMEDOUT', 'RESTRICTED', 'VOID'].includes(ch.status) && o.status === 'pending')
    await updateOrder(o.id, { status: 'failed', payment_ref: ch.id });
  return NextResponse.json({ ok: true });
}

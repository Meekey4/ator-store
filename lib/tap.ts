import 'server-only';
import type { Order } from './db';

// Tap Payments (tap.company): one hosted page offering BenefitPay and debit/credit cards.
const KEY = process.env.TAP_SECRET_KEY || '';
export const paymentsEnabled = () => !!KEY;
const API = 'https://api.tap.company/v2';

export async function createCharge(o: Order, baseUrl: string) {
  const [first, ...rest] = (o.name || 'Customer').split(' ');
  const digits = (o.phone || '').replace(/\D/g, '');
  const local = digits.startsWith('973') ? digits.slice(3) : digits;
  const res = await fetch(`${API}/charges`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Number((o.total / 1000).toFixed(3)), currency: 'BHD', threeDSecure: true, save_card: false,
      description: `ATOR order ${o.id}`,
      reference: { transaction: o.id, order: o.id },
      receipt: { email: true, sms: false },
      customer: { first_name: first, last_name: rest.join(' ') || '-', email: o.email, phone: local ? { country_code: '973', number: local } : undefined },
      source: { id: 'src_all' },
      post: { url: `${baseUrl}/api/tap/webhook` },
      redirect: { url: `${baseUrl}/${o.lang}/orders/${o.id}?t=${o.token}` },
      metadata: { order: o.id },
    }),
  });
  const j = await res.json();
  if (!res.ok || !j?.transaction?.url) throw new Error(j?.errors?.[0]?.description || 'Payment provider error');
  return { id: j.id as string, url: j.transaction.url as string };
}

export async function getCharge(id: string) {
  const res = await fetch(`${API}/charges/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${KEY}` }, cache: 'no-store' });
  if (!res.ok) return null;
  const j = await res.json();
  return { id: j.id as string, status: j.status as string, order: (j.reference?.order || j.metadata?.order) as string | undefined, method: (j.source?.payment_method || j.source?.id || null) as string | null };
}

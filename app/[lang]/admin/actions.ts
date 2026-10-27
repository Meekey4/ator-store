'use server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentUser, isAdmin } from '@/lib/auth';
import { getOrder, getProduct, saveProduct, updateOrder, type Plan, type Product } from '@/lib/db';

async function guard() { if (!isAdmin(await currentUser())) notFound(); }
const s = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

export async function saveOrderAdmin(f: FormData) {
  await guard();
  const id = s(f, 'id'); const lang = s(f, 'lang') || 'en';
  const o = await getOrder(id); if (!o) notFound();
  const status = s(f, 'status');
  const patch: Parameters<typeof updateOrder>[1] = { delivery: s(f, 'delivery') || null, admin_note: s(f, 'admin_note') || null };
  if (['pending', 'paid', 'delivered', 'cancelled', 'refunded', 'failed'].includes(status)) {
    patch.status = status;
    if (status === 'delivered' && !o.delivered_at) patch.delivered_at = new Date().toISOString();
    if (status === 'paid' && !o.paid_at) { patch.paid_at = new Date().toISOString(); patch.payment_method = o.payment_method || 'manual'; }
  }
  await updateOrder(id, patch);
  revalidatePath(`/${lang}/admin`);
  redirect(`/${lang}/admin/orders/${id}?saved=1`);
}

export async function saveProductAdmin(f: FormData) {
  await guard();
  const lang = s(f, 'lang') || 'en';
  const orig = s(f, 'orig');
  const slug = s(f, 'slug').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug) redirect(`/${lang}/admin/products/${orig || 'new'}?e=slug`);
  const prev = orig ? await getProduct(orig) : null;
  if (!orig && (await getProduct(slug))) redirect(`/${lang}/admin/products/new?e=exists`);
  const ids = f.getAll('plan_id').map(String);
  const plans: Plan[] = ids.map((id, i) => ({
    id: id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') ,
    label: { en: String(f.getAll('plan_en')[i] || '').trim(), ar: String(f.getAll('plan_ar')[i] || '').trim() },
    price: Math.round(parseFloat(String(f.getAll('plan_price')[i] || '0')) * 1000) || 0,
    stock: Math.max(0, parseInt(String(f.getAll('plan_stock')[i] || '0')) || 0),
  })).filter((p) => p.id && p.label.en && p.price > 0);
  const p: Product = {
    slug,
    name: { en: s(f, 'name_en'), ar: s(f, 'name_ar') || s(f, 'name_en') },
    brief: { en: s(f, 'brief_en'), ar: s(f, 'brief_ar') },
    desc: { en: s(f, 'desc_en'), ar: s(f, 'desc_ar') },
    cat: s(f, 'cat') || 'ent', type: s(f, 'type') || 'sub',
    logo: prev?.logo ?? null,
    image: s(f, 'image') || prev?.image || `/products/${slug}.webp`,
    plans, active: f.get('active') === 'on', sort: parseInt(s(f, 'sort')) || 0,
  };
  await saveProduct(p);
  if (orig && orig !== slug) { /* slug changed: keep the old row inactive so old links 404 cleanly */ if (prev) await saveProduct({ ...prev, active: false }); }
  revalidatePath(`/${lang}`, 'layout');
  redirect(`/${lang}/admin/products/${slug}?saved=1`);
}

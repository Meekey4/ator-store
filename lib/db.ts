import 'server-only';
import { neon } from '@neondatabase/serverless';
import catalog from '@/data/catalog.json';
import type { L10n } from './i18n';

export type Plan = { id: string; label: L10n; price: number; stock: number };
export type Product = {
  slug: string; name: L10n; cat: string; type: string; logo?: string | null;
  brief: L10n; desc?: L10n; image?: string; plans: Plan[]; active: boolean; sort: number;
};
export type User = { id: string; email: string; name: string; phone: string; pass: string; created_at: string };
export type OrderItem = { slug: string; planId: string; name: L10n; plan: L10n; price: number; qty: number };
export type Order = {
  id: string; token: string; user_id: string | null; email: string; name: string; phone: string; lang: string;
  items: OrderItem[]; total: number; status: string; payment_ref: string | null; payment_method: string | null;
  delivery: string | null; admin_note: string | null; created_at: string; paid_at: string | null; delivered_at: string | null;
};

const URL_ = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
export const DEMO = !URL_;

const seedProducts = (): Product[] =>
  (catalog as Omit<Product, 'sort'>[]).map((p, i) => ({ ...p, image: `/products/${p.slug}.webp`, sort: i }));

/* ---------- memory store (no DATABASE_URL: demo preview, resets on redeploy) ---------- */
type Mem = { products: Product[]; users: User[]; orders: Order[] };
const g = globalThis as unknown as { __atorMem?: Mem };
const mem = (): Mem => (g.__atorMem ??= { products: seedProducts(), users: [], orders: [] });

/* ---------- postgres ---------- */
const sql = URL_ ? neon(URL_) : null;
let ready: Promise<void> | null = null;
async function init() {
  if (!sql) return;
  ready ??= (async () => {
    await sql.query(`create table if not exists products (slug text primary key, data jsonb not null, active boolean not null default true, sort int not null default 0, updated_at timestamptz default now())`);
    await sql.query(`create table if not exists users (id text primary key, email text unique not null, name text, phone text, pass text not null, created_at timestamptz default now())`);
    await sql.query(`create table if not exists orders (id text primary key, token text not null, user_id text, email text not null, name text, phone text, lang text, items jsonb not null, total int not null, status text not null, payment_ref text, payment_method text, delivery text, admin_note text, created_at timestamptz default now(), paid_at timestamptz, delivered_at timestamptz)`);
    const c = (await sql.query(`select count(*)::int as n from products`)) as { n: number }[];
    if (c[0].n === 0) for (const p of seedProducts()) await saveProduct(p);
  })();
  await ready;
}
const toProduct = (r: { slug: string; data: Omit<Product, 'slug' | 'active' | 'sort'>; active: boolean; sort: number }): Product =>
  ({ ...r.data, slug: r.slug, active: r.active, sort: r.sort });
const iso = (v: unknown) => (v == null ? null : new Date(v as string).toISOString());
const toOrder = (r: Record<string, unknown>): Order =>
  ({ ...(r as Order), created_at: iso(r.created_at)!, paid_at: iso(r.paid_at), delivered_at: iso(r.delivered_at) });

/* ---------- products ---------- */
export async function listProducts(opts: { all?: boolean } = {}): Promise<Product[]> {
  if (!sql) return [...mem().products].filter((p) => opts.all || p.active).sort((a, b) => a.sort - b.sort);
  await init();
  const rows = (await sql.query(`select * from products ${opts.all ? '' : 'where active'} order by sort, slug`)) as Parameters<typeof toProduct>[0][];
  return rows.map(toProduct);
}
export async function getProduct(slug: string): Promise<Product | null> {
  if (!sql) return mem().products.find((p) => p.slug === slug) ?? null;
  await init();
  const rows = (await sql.query(`select * from products where slug=$1`, [slug])) as Parameters<typeof toProduct>[0][];
  return rows[0] ? toProduct(rows[0]) : null;
}
export async function saveProduct(p: Product) {
  if (!sql) { const m = mem(); const i = m.products.findIndex((x) => x.slug === p.slug); if (i >= 0) m.products[i] = p; else m.products.push(p); return; }
  const { slug, active, sort, ...data } = p;
  await sql.query(
    `insert into products (slug,data,active,sort,updated_at) values ($1,$2,$3,$4,now()) on conflict (slug) do update set data=$2, active=$3, sort=$4, updated_at=now()`,
    [slug, JSON.stringify(data), active, sort]);
}

/* ---------- users ---------- */
export async function findUser(email: string): Promise<User | null> {
  email = email.trim().toLowerCase();
  if (!sql) return mem().users.find((u) => u.email === email) ?? null;
  await init();
  const r = (await sql.query(`select * from users where email=$1`, [email])) as User[];
  return r[0] ?? null;
}
export async function getUser(id: string): Promise<User | null> {
  if (!sql) return mem().users.find((u) => u.id === id) ?? null;
  await init();
  const r = (await sql.query(`select * from users where id=$1`, [id])) as User[];
  return r[0] ?? null;
}
export async function createUser(u: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const user: User = { ...u, email: u.email.trim().toLowerCase(), id: crypto.randomUUID(), created_at: new Date().toISOString() };
  if (!sql) { mem().users.push(user); return user; }
  await init();
  await sql.query(`insert into users (id,email,name,phone,pass) values ($1,$2,$3,$4,$5)`, [user.id, user.email, user.name, user.phone, user.pass]);
  return user;
}

/* ---------- orders ---------- */
const code = () => 'AT-' + Math.floor(100000 + Math.random() * 900000);
export async function createOrder(o: Omit<Order, 'id' | 'token' | 'created_at' | 'paid_at' | 'delivered_at' | 'payment_ref' | 'payment_method' | 'delivery' | 'admin_note' | 'status'>): Promise<Order> {
  const order: Order = {
    ...o, id: code(), token: crypto.randomUUID().replace(/-/g, ''), status: 'pending', payment_ref: null, payment_method: null,
    delivery: null, admin_note: null, created_at: new Date().toISOString(), paid_at: null, delivered_at: null,
  };
  if (!sql) { mem().orders.unshift(order); return order; }
  await init();
  await sql.query(
    `insert into orders (id,token,user_id,email,name,phone,lang,items,total,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')`,
    [order.id, order.token, order.user_id, order.email, order.name, order.phone, order.lang, JSON.stringify(order.items), order.total]);
  return order;
}
export async function getOrder(id: string): Promise<Order | null> {
  if (!sql) return mem().orders.find((x) => x.id === id) ?? null;
  await init();
  const r = (await sql.query(`select * from orders where id=$1`, [id])) as Record<string, unknown>[];
  return r[0] ? toOrder(r[0]) : null;
}
export async function listOrders(f: { userId?: string; email?: string; status?: string; limit?: number } = {}): Promise<Order[]> {
  const lim = f.limit ?? 200;
  if (!sql) return mem().orders.filter((o) => (!f.userId || o.user_id === f.userId || (f.email && o.email === f.email)) && (!f.status || o.status === f.status)).slice(0, lim);
  await init();
  const where: string[] = []; const args: unknown[] = [];
  if (f.userId) { args.push(f.userId, f.email ?? ''); where.push(`(user_id=$${args.length - 1} or email=$${args.length})`); }
  if (f.status) { args.push(f.status); where.push(`status=$${args.length}`); }
  const r = (await sql.query(`select * from orders ${where.length ? 'where ' + where.join(' and ') : ''} order by created_at desc limit ${lim}`, args)) as Record<string, unknown>[];
  return r.map(toOrder);
}
export async function updateOrder(id: string, patch: Partial<Pick<Order, 'status' | 'payment_ref' | 'payment_method' | 'delivery' | 'admin_note' | 'paid_at' | 'delivered_at'>>) {
  if (!sql) { const o = mem().orders.find((x) => x.id === id); if (o) Object.assign(o, patch); return; }
  await init();
  const keys = Object.keys(patch) as (keyof typeof patch)[];
  if (!keys.length) return;
  await sql.query(`update orders set ${keys.map((k, i) => `${k}=$${i + 2}`).join(', ')} where id=$1`, [id, ...keys.map((k) => patch[k])]);
}

/** Mark an order paid once (idempotent) and take the purchased plans out of stock. */
export async function markPaid(id: string, ref: string, method: string | null) {
  const o = await getOrder(id);
  if (!o || o.status !== 'pending' && o.status !== 'failed') return o;
  await updateOrder(id, { status: 'paid', payment_ref: ref, payment_method: method, paid_at: new Date().toISOString() });
  for (const it of o.items) {
    const p = await getProduct(it.slug); if (!p) continue;
    p.plans = p.plans.map((pl) => (pl.id === it.planId ? { ...pl, stock: Math.max(0, pl.stock - it.qty) } : pl));
    await saveProduct(p);
  }
  return getOrder(id);
}

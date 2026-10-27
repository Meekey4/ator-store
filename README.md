# ATOR Store

Next.js 15 store for ATOR (Bahrain): catalog, plans, cart, checkout with BenefitPay and cards through Tap Payments, customer accounts, order tracking, and an admin for orders, delivery and stock. English and Arabic (RTL).

## Go live in 4 steps (Vercel dashboard)

1. **Database:** Project → Storage → Create → **Neon (Postgres)** → connect to this project. This sets `DATABASE_URL`. Tables are created and filled from `data/catalog.json` on first request. Until then the site runs in preview mode (data resets on every deploy).
2. **Environment variables** (Project → Settings → Environment Variables), see `.env.example`:
   - `AUTH_SECRET`: any random 32+ characters
   - `ADMIN_EMAILS`: emails allowed into `/en/admin` (comma separated)
   - `TAP_SECRET_KEY`: from the Tap dashboard (start with `sk_test_…`)
   - `NEXT_PUBLIC_WHATSAPP`: support number, digits only, e.g. `97333000000`
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://ator.bh`
3. **Tap webhook:** in Tap, set the post URL to `https://YOUR-DOMAIN/api/tap/webhook`. Payments are also confirmed when the customer returns to the order page.
4. **Domain:** Project → Settings → Domains → add the domain and set the DNS records Vercel shows. Redeploy after changing env vars.

## Admin
Register at `/en/account?mode=up` with an email listed in `ADMIN_EMAILS`, then open **Admin** in the header.
- **Orders:** filter by status, open an order, write the delivery details (codes, login) and set status to *Delivered*; the customer sees it on their order page. A WhatsApp button pre-fills the message.
- **Products & stock:** edit names, briefs, plans, prices (BHD) and stock; hide or show products; add new ones. Stock goes down automatically when an order is paid.

## Develop
```
npm install
npm run dev
```
Prices are stored in fils (1 BHD = 1000 fils).

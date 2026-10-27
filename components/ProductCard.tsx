import Link from 'next/link';
import type { Product } from '@/lib/db';
import { dict, t, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';

export const fromPrice = (p: Product) => (p.plans.length ? Math.min(...p.plans.map((x) => x.price)) : null);
export const inStock = (p: Product) => p.plans.some((x) => x.stock > 0);

export function ProductCard({ p, lang }: { p: Product; lang: Lang }) {
  const d = dict(lang);
  const from = fromPrice(p);
  const ok = inStock(p);
  return (
    <Link href={`/${lang}/p/${p.slug}`} className={`card glass ${ok ? '' : 'off'}`}>
      <div className="img"><img src={p.image || `/products/${p.slug}.webp`} alt={t(p.name, lang)} loading="lazy" width={600} height={600} /></div>
      <div className="body">
        <div className="name">{t(p.name, lang)}</div>
        <div className="brief">{t(p.brief, lang)}</div>
        <div className="row">
          <span className="price num">{from != null ? `${p.plans.length > 1 ? d.from + ' ' : ''}${bhd(from, lang)}` : d.comingSoon}</span>
          <span className={`tag ${ok ? 'ok' : 'no'}`}>{ok ? d.avail : d.outOfStock}</span>
        </div>
      </div>
    </Link>
  );
}

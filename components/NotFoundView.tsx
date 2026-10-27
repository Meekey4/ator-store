'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATS } from '@/lib/i18n';

export function NotFoundView() {
  const path = usePathname() || '';
  const lang = path.startsWith('/ar') ? 'ar' : 'en';
  const ar = lang === 'ar';
  return (
    <div className="wrap nf">
      <p className="nf-code num" aria-hidden="true">404</p>
      <h1>{ar ? 'هذه الصفحة غير موجودة' : 'We can’t find that page'}</h1>
      <p className="muted">{ar ? 'ربما تغيّر الرابط أو لم يعد المنتج متاحًا. جرّب البحث أو تصفح الأقسام.' : 'The link may have changed, or the product is no longer available. Try a search or browse a category.'}</p>
      <form action={`/${lang}/shop`} className="nf-search">
        <input name="q" placeholder={ar ? 'ابحث عن منتج' : 'Search products'} aria-label={ar ? 'ابحث عن منتج' : 'Search products'} />
        <button className="btn primary">{ar ? 'بحث' : 'Search'}</button>
      </form>
      <div className="chips" style={{ justifyContent: 'center' }}>
        {Object.entries(CATS).map(([k, v]) => <Link key={k} className="chip" href={`/${lang}/shop?cat=${k}`}>{v[lang]}</Link>)}
      </div>
      <div className="nf-links">
        <Link className="btn ghost" href={`/${lang}`}>{ar ? 'الصفحة الرئيسية' : 'Home'}</Link>
        <Link className="btn ghost" href={`/${lang}/info/faq`}>{ar ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
      </div>
    </div>
  );
}

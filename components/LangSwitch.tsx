'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function LangSwitch({ lang }: { lang: 'en' | 'ar' }) {
  const path = usePathname() || `/${lang}`;
  const qs = useSearchParams()?.toString();
  const other = lang === 'en' ? 'ar' : 'en';
  const href = path.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) + (qs ? `?${qs}` : '');
  return <Link className="iconbtn" href={href} hrefLang={other} lang={other}>{other === 'ar' ? 'العربية' : 'English'}</Link>;
}

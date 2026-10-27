import Link from 'next/link';
import { Logo } from './Logo';
import { CartBadge } from './Cart';
import { dict, type Lang } from '@/lib/i18n';
import { currentUser, isAdmin } from '@/lib/auth';
import { DEMO } from '@/lib/db';
import { Suspense } from 'react';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle, TextSize } from './Prefs';
import { CookieSettingsLink } from './Analytics';
import { BUSINESS } from '@/lib/content';
import { CATS } from '@/lib/i18n';

export async function Header({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const u = await currentUser();
  const other = lang === 'en' ? 'ar' : 'en';
  return (
    <>
      {DEMO ? <div className="demo">{lang === 'ar' ? 'نسخة تجريبية: البيانات تُعاد عند كل تحديث. اربط قاعدة البيانات لتفعيل المتجر.' : 'Preview mode: data resets on each update. Connect the database to go live.'}</div> : null}
      <header className="hdr">
        <div className="wrap">
          <Link href={`/${lang}`} className="logo" aria-label="ATOR home"><Logo id="hd" /></Link>
          <nav className="nav">
            <Link href={`/${lang}/shop`}>{d.shop}</Link>
            <Link href={`/${lang}/shop?cat=ent`}>{lang === 'ar' ? 'ترفيه' : 'Entertainment'}</Link>
            <Link href={`/${lang}/shop?cat=ai`}>{lang === 'ar' ? 'ذكاء اصطناعي' : 'AI tools'}</Link>
            <Link href={`/${lang}/info/faq`}>{d.faq}</Link>
            {isAdmin(u) ? <Link href={`/${lang}/admin`}>{d.admin}</Link> : null}
          </nav>
          <span className="sp" />
          <ThemeToggle lang={lang} />
          <Suspense fallback={<Link className="iconbtn" href={`/${other}`}>{other === 'ar' ? 'العربية' : 'English'}</Link>}><LangSwitch lang={lang} /></Suspense>
          <Link className="iconbtn" href={`/${lang}/account`} aria-label={d.account}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
            <span className="lbl">{u ? (u.name || d.account).split(' ')[0] : d.signIn}</span>
          </Link>
          <Link className="iconbtn" href={`/${lang}/cart`} aria-label={d.cart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 7h14l-1.5 12h-11z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
            <CartBadge label={d.cart} />
          </Link>
        </div>
      </header>
    </>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const ar = lang === 'ar';
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div className="ftr-brand">
          <Logo id="ft" height={18} />
          <span>{d.tagline}</span>
          <span className="faint">
            © {new Date().getFullYear()} {BUSINESS.name}{BUSINESS.cr ? ` · ${ar ? 'س.ت' : 'CR'} ${BUSINESS.cr}` : ''} · {BUSINESS.address || (ar ? 'مملكة البحرين' : 'Kingdom of Bahrain')}
          </span>
          <TextSize lang={lang} />
          {BUSINESS.email || wa ? <span className="faint">{BUSINESS.email}{BUSINESS.email && wa ? ' · ' : ''}{wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp +{wa}</a> : null}</span> : null}
        </div>
        <nav aria-label={d.shop}>
          <b>{d.shop}</b>
          <Link href={`/${lang}/shop`}>{d.allProducts}</Link>
          {Object.entries(CATS).map(([k, v]) => <Link key={k} href={`/${lang}/shop?cat=${k}`}>{v[lang]}</Link>)}
        </nav>
        <nav aria-label={ar ? 'المساعدة' : 'Help'}>
          <b>{ar ? 'المساعدة' : 'Help'}</b>
          <Link href={`/${lang}/info/faq`}>{d.faq}</Link>
          <Link href={`/${lang}/account`}>{d.myOrders}</Link>
          {wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">{d.contact} · WhatsApp</a> : null}
        </nav>
        <nav aria-label={ar ? 'السياسات' : 'Policies'}>
          <b>{ar ? 'السياسات' : 'Policies'}</b>
          <Link href={`/${lang}/info/terms`}>{d.terms}</Link>
          <Link href={`/${lang}/info/refunds`}>{d.refunds}</Link>
          <Link href={`/${lang}/info/privacy`}>{d.privacy}</Link>
          <Link href={`/${lang}/info/cookies`}>{d.cookies}</Link>
          <CookieSettingsLink label={d.cookieSettings} />
        </nav>
      </div>
    </footer>
  );
}

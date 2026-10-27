'use client';
import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';

const KEY = 'ator_consent_v1';
const GA = process.env.NEXT_PUBLIC_GA_ID || '';

/** Cookie banner + Google Analytics 4. Nothing appears unless NEXT_PUBLIC_GA_ID is set, and GA loads only after "Accept". */
export function Analytics({ lang }: { lang: Lang }) {
  const [choice, setChoice] = useState<string | null>('unset');
  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch { /* ignore */ }
    setChoice(v);
    const reopen = () => setChoice(null);
    window.addEventListener('ator-cookie-settings', reopen);
    return () => window.removeEventListener('ator-cookie-settings', reopen);
  }, []);
  if (!GA) return null;
  const ar = lang === 'ar';
  const set = (v: 'yes' | 'no') => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } if (v === 'no' && choice === 'yes') location.reload(); setChoice(v); };
  return (
    <>
      {choice === 'yes' ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}</Script>
        </>
      ) : null}
      {choice === null ? (
        <div className="cookiebar" role="dialog" aria-live="polite" aria-label={ar ? 'ملفات تعريف الارتباط' : 'Cookies'}>
          <p>{ar ? 'نستخدم ملفًا ضروريًا لتسجيل الدخول. هل تسمح لنا باستخدام Google Analytics لفهم كيفية استخدام المتجر؟ ' : 'We use one essential cookie to keep you signed in. May we also use Google Analytics to understand how the store is used? '}<Link href={`/${lang}/info/cookies`}>{ar ? 'التفاصيل' : 'Details'}</Link></p>
          <div className="cookiebar-btns">
            <button type="button" className="btn ghost sm" onClick={() => set('no')}>{ar ? 'الضرورية فقط' : 'Essential only'}</button>
            <button type="button" className="btn primary sm" onClick={() => set('yes')}>{ar ? 'موافق' : 'Accept analytics'}</button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CookieSettingsLink({ label }: { label: string }) {
  if (!GA) return null;
  return <button type="button" className="linkbtn" onClick={() => window.dispatchEvent(new Event('ator-cookie-settings'))}>{label}</button>;
}

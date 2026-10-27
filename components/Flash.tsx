'use client';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from './Cart';

const MSG: Record<string, { en: string; ar: string }> = {
  welcome: { en: 'Your account is ready. Welcome to ATOR!', ar: 'تم إنشاء حسابك. أهلًا بك في ATOR!' },
  signedin: { en: 'You are signed in.', ar: 'تم تسجيل الدخول.' },
  signedout: { en: 'You are signed out.', ar: 'تم تسجيل الخروج.' },
  saved: { en: 'Changes saved.', ar: 'تم حفظ التغييرات.' },
};

/** Shows a short confirmation toast after a form redirects back with ?msg=… and then removes the parameter. */
export function Flash({ lang }: { lang: 'en' | 'ar' }) {
  const sp = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const { flash } = useCart();
  const key = sp?.get('msg') || '';
  useEffect(() => {
    if (!key || !MSG[key]) return;
    flash(MSG[key][lang]);
    const rest = new URLSearchParams(sp?.toString()); rest.delete('msg');
    router.replace(path + (rest.toString() ? `?${rest}` : ''), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

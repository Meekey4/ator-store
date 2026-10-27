import Link from 'next/link';
import type { Metadata } from 'next';
import { currentUser, isAdmin } from '@/lib/auth';
import { listOrders } from '@/lib/db';
import { STATUS, dict, type Lang } from '@/lib/i18n';
import { bhd } from '@/lib/money';
import { signIn, signOut, signUp } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Account', robots: { index: false } };

export default async function Account({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ mode?: string; e?: string }> }) {
  const { lang } = await params;
  const { mode, e } = await searchParams;
  const d = dict(lang);
  const u = await currentUser();
  const ar = lang === 'ar';

  if (!u) {
    const up = mode === 'up';
    const msg = e === 'login' ? d.badLogin : e === 'taken' ? d.emailTaken : e === 'invalid' ? (ar ? 'أدخل اسمك وبريدًا صحيحًا وكلمة مرور من 8 أحرف على الأقل.' : 'Enter your name, a valid email and a password of at least 8 characters.') : '';
    return (
      <div className="wrap" style={{ maxWidth: 460, margin: '50px auto 70px' }}>
        <div className="glass pad">
          <h1 style={{ fontSize: 30, marginBottom: 18 }}>{up ? d.signUp : d.signIn}</h1>
          <form action={up ? signUp : signIn}>
            <input type="hidden" name="lang" value={lang} />
            {up ? <label className="field"><span>{d.name}</span><input name="name" required autoComplete="name" /></label> : null}
            <label className="field"><span>{d.email}</span><input name="email" type="email" required autoComplete="email" /></label>
            {up ? <label className="field"><span>{d.phone}</span><input name="phone" type="tel" autoComplete="tel" /></label> : null}
            <label className="field"><span>{d.password}</span><input name="password" type="password" required minLength={up ? 8 : 1} autoComplete={up ? 'new-password' : 'current-password'} /></label>
            {msg ? <div className="err" role="alert">{msg}</div> : null}
            <button className="btn primary block">{up ? d.signUp : d.signIn}</button>
          </form>
          <p className="note" style={{ textAlign: 'center' }}>
            {up ? d.haveAccount : d.noAccount}{' '}
            <Link href={`/${lang}/account${up ? '' : '?mode=up'}`} style={{ textDecoration: 'underline', color: 'var(--text)' }}>{up ? d.signIn : d.signUp}</Link>
          </p>
        </div>
      </div>
    );
  }

  const orders = await listOrders({ userId: u.id, email: u.email, limit: 50 });
  return (
    <div className="wrap" style={{ margin: '40px auto 70px' }}>
      <div className="section-h">
        <div><span className="eyebrow">{d.account}</span><h1 style={{ fontSize: 34, marginTop: 6 }}>{u.name}</h1><p className="muted" style={{ margin: '6px 0 0' }}>{u.email}</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin(u) ? <Link className="btn ghost" href={`/${lang}/admin`}>{d.admin}</Link> : null}
          <form action={signOut}><input type="hidden" name="lang" value={lang} /><button className="btn ghost">{d.signOut}</button></form>
        </div>
      </div>
      <div className="glass pad">
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>{d.myOrders}</h2>
        {orders.length ? (
          <div className="tbl"><table>
            <thead><tr><th>{d.order}</th><th>{d.date}</th><th>{d.orderStatus}</th><th>{d.total}</th><th /></tr></thead>
            <tbody>{orders.map((o) => (
              <tr key={o.id}>
                <td className="num">{o.id}</td>
                <td>{new Date(o.created_at).toLocaleDateString(ar ? 'ar-BH' : 'en-GB', { timeZone: 'Asia/Bahrain' })}</td>
                <td className={`st-${o.status}`}>{STATUS[o.status]?.[lang]}</td>
                <td className="num">{bhd(o.total, lang)}</td>
                <td><Link href={`/${lang}/orders/${o.id}`} style={{ textDecoration: 'underline' }}>{d.viewOrder}</Link></td>
              </tr>))}</tbody>
          </table></div>
        ) : <p className="muted">{d.noOrders}</p>}
      </div>
    </div>
  );
}

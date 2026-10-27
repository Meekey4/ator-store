'use server';
import { redirect } from 'next/navigation';
import { createUser, findUser } from '@/lib/db';
import { checkPassword, endSession, hashPassword, startSession } from '@/lib/auth';

const L = (f: FormData) => (f.get('lang') === 'ar' ? 'ar' : 'en');

export async function signIn(f: FormData) {
  const lang = L(f);
  const u = await findUser(String(f.get('email') || ''));
  if (!u || !(await checkPassword(String(f.get('password') || ''), u.pass))) redirect(`/${lang}/account?e=login`);
  await startSession(u);
  redirect(`/${lang}/account?msg=signedin`);
}

export async function signUp(f: FormData) {
  const lang = L(f);
  const email = String(f.get('email') || '').trim().toLowerCase();
  const pass = String(f.get('password') || '');
  const name = String(f.get('name') || '').trim().slice(0, 80);
  const phone = String(f.get('phone') || '').trim().slice(0, 30);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || pass.length < 8 || !name) redirect(`/${lang}/account?mode=up&e=invalid`);
  if (await findUser(email)) redirect(`/${lang}/account?mode=up&e=taken`);
  const u = await createUser({ email, name, phone, pass: await hashPassword(pass) });
  await startSession(u);
  redirect(`/${lang}/account?msg=welcome`);
}

export async function signOut(f: FormData) {
  await endSession();
  redirect(`/${L(f)}?msg=signedout`);
}

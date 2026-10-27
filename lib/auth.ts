import 'server-only';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { DEMO, getUser, type User } from './db';

const COOKIE = 'ator_session';
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-secret-change-me-in-production');

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const checkPassword = (p: string, h: string) => bcrypt.compare(p, h);

export async function startSession(u: User) {
  const jwt = await new SignJWT({ uid: u.id, em: u.email, nm: u.name, ph: u.phone }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('30d').sign(secret());
  (await cookies()).set(COOKIE, jwt, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function currentUser(): Promise<User | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  try {
    const { payload } = await jwtVerify(c, secret());
    if (!payload.uid) return null;
    const u = await getUser(String(payload.uid));
    // Preview mode keeps accounts in short-lived server memory, so the account can vanish between requests.
    // The signed cookie still proves who signed in, so rebuild the user from it.
    if (!u && DEMO && typeof payload.em === 'string') return { id: String(payload.uid), email: payload.em, name: String(payload.nm || ''), phone: String(payload.ph || ''), pass: '', created_at: '' };
    return u;
  } catch { return null; }
}

export const isAdmin = (u: User | null) =>
  !!u && (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).includes(u.email);

export const adminEmailsSet = () => (process.env.ADMIN_EMAILS || '').split(',').some((s) => s.trim());

/** Gate for admin pages: sends signed-out visitors to sign in, explains a missing ADMIN_EMAILS setting, and hides admin from everyone else. */
export async function requireAdmin(lang: string) {
  const u = await currentUser();
  if (!u) redirect(`/${lang}/account?msg=adminsignin`);
  if (!adminEmailsSet()) redirect(`/${lang}/account?msg=noadmin`);
  if (!isAdmin(u)) notFound();
  return u;
}

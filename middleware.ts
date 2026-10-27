import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/^\/(en|ar)(\/|$)/.test(pathname)) return NextResponse.next();
  const pref = req.cookies.get('ator_lang')?.value || (req.headers.get('accept-language') || '').toLowerCase();
  const lang = pref.startsWith('ar') ? 'ar' : 'en';
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/((?!api|_next|products|brand|favicon.ico|robots.txt|sitemap.xml).*)'] };

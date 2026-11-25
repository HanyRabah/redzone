import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isApi = pathname.startsWith('/api');
  const isAuthPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');

  // Protect matched API routes (/api/admin/*, /api/user*): require an authenticated
  // token and answer with JSON 401 rather than an HTML redirect.
  if (isApi) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Page-level redirects
  if (!token && isAdminPage && !isAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
  ],
};

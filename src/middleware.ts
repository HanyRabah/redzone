import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for static files
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/favicon.ico' ||
    request.nextUrl.pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === '/admin/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // If user is not authenticated and trying to access admin pages (except login)
  if (!token && isAdminPage && !isAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If user is authenticated and trying to access login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
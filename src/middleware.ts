import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    const auth = localStorage.getItem('auth');
    const isAuthPage = request.nextUrl.pathname === '/login';

    if (!auth && !isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (auth && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 
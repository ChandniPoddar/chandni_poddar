import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = req.nextUrl.pathname === '/admin/login';

    if (isAdminRoute && !isLoginPage && !token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith('/admin/login')) return true;
        if (req.nextUrl.pathname.startsWith('/admin')) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};

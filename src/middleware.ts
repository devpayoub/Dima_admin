import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (!payload.exp || typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('STAMPEE_ADMIN_TOKEN')?.value;

    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL('/', request.url);
      if (!token) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('STAMPEE_ADMIN_TOKEN');
      response.cookies.delete('STAMPEE_ADMIN_REFRESH_TOKEN');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

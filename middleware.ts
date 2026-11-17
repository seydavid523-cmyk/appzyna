import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  if (request.nextUrl.pathname === '/') {
    if (host === 'appzyna.shop' || host === 'www.appzyna.shop') return NextResponse.rewrite(new URL('/store', request.url));
    if (host === 'appzyna.online' || host === 'www.appzyna.online') return NextResponse.rewrite(new URL('/portal', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/'] };

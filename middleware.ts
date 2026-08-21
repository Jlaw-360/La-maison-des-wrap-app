import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const enableSubdomains = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAINS === 'true';

  if (enableSubdomains) {
    if (hostname.startsWith('admin.')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    if (hostname.startsWith('kitchen.')) {
      url.pathname = `/kitchen${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    if (hostname.startsWith('drive.') || hostname.startsWith('driver.')) {
      url.pathname = `/driver${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

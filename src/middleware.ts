import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN } from './utils/cookieManage';

const publicOnlyUrls: Record<string, boolean> = {
  '/': true,
};

export async function middleware(request: NextRequest) {
  const token = cookies().get(ACCESS_TOKEN)?.value;
  const exits = publicOnlyUrls[request.nextUrl.pathname];

  if (!token) {
    if (!exits) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (exits) {
      return NextResponse.redirect(new URL('/dash-board', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

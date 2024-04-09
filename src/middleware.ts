import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./services/httpClient";

export async function middleware(request: NextRequest) {
  const token = cookies().get(ACCESS_TOKEN);
  const pathname = request.nextUrl.pathname;

  if ((token && pathname === "/dash-board") || (!token && pathname === "/")) {
    return NextResponse.next();
  }

  if (token) {
    return NextResponse.redirect(new URL("/dash-board", request.url));
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

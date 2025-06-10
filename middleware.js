// middleware.js - Allow all requests for now
import { NextResponse } from "next/server";

export function middleware(request) {
  // Allow all requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


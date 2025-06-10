// middleware.js - Simple middleware without dependencies
import { NextResponse } from "next/server";

export function middleware(request) {
  // Allow all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


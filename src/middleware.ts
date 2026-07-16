import { NextRequest, NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/security";

const ADMIN_TOKEN = "mock-admin-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const token = request.cookies.get("admin_token")?.value;

  if (isAdminRoute && !isLoginPage && token !== ADMIN_TOKEN) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && token === ADMIN_TOKEN) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

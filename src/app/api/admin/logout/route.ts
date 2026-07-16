import { NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/security";

export async function POST() {
  const response = NextResponse.json({ success: true });
  applySecurityHeaders(response);
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return response;
}

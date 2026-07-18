import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { applySecurityHeaders, checkRateLimit, sanitizeText, validateEmail } from "@/lib/security";

const supabaseUrl = process.env.supabase_url || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.supabase_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "admin-login", 5, 15_000);
  if (!rateLimit.ok) {
    const response = NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
    applySecurityHeaders(response);
    response.headers.set("Retry-After", String(rateLimit.retryAfter));
    return response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const response = NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    applySecurityHeaders(response);
    return response;
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    const response = NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    applySecurityHeaders(response);
    return response;
  }

  const { email, password } = body as { email?: unknown; password?: unknown };
  const normalizedEmail = sanitizeText(email);
  const normalizedPassword = sanitizeText(password);

  if (!validateEmail(normalizedEmail) || normalizedPassword.length < 6) {
    const response = NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    applySecurityHeaders(response);
    return response;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: normalizedPassword,
  });

  if (error || !data.session) {
    const response = NextResponse.json({ error: error?.message || "Credenciais inválidas" }, { status: 401 });
    applySecurityHeaders(response);
    return response;
  }

  const response = NextResponse.json({ success: true });
  applySecurityHeaders(response);
  response.cookies.set("admin_token", "mock-admin-session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}

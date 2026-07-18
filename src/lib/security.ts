import { NextRequest, NextResponse } from "next/server";
import type { Category } from "./types";

const RATE_LIMIT_BUCKETS = new Map<string, { count: number; resetAt: number }>();

export const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'none'; upgrade-insecure-requests;",
  },
];

export function applySecurityHeaders(response: NextResponse) {
  SECURITY_HEADERS.forEach(({ key, value }) => response.headers.set(key, value));
}

export function hasAdminSession(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  return Boolean(token && token.trim().length > 0);
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
  return forwarded?.split(",")[0].trim() || "unknown";
}

export function checkRateLimit(
  request: NextRequest,
  key: string,
  limit = 10,
  windowMs = 60_000
) {
  const bucketKey = `${key}:${getClientIp(request)}`;
  const now = Date.now();
  const existing = RATE_LIMIT_BUCKETS.get(bucketKey);

  if (existing && existing.resetAt > now) {
    if (existing.count >= limit) {
      return {
        ok: false,
        retryAfter: Math.ceil((existing.resetAt - now) / 1000),
      };
    }

    RATE_LIMIT_BUCKETS.set(bucketKey, {
      count: existing.count + 1,
      resetAt: existing.resetAt,
    });
    return { ok: true, retryAfter: 0 };
  }

  RATE_LIMIT_BUCKETS.set(bucketKey, { count: 1, resetAt: now + windowMs });
  return { ok: true, retryAfter: 0 };
}

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

export function validateEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validatePhone(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function validateCpf(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length === 11;
}

export function isAllowedCategory(value: unknown): value is Category {
  if (typeof value !== "string") return false;
  return [
    "ceramica",
    "croche",
    "macrame",
    "chapeus",
    "balaclavas",
    "amigurumi",
  ].includes(value as Category);
}

export function validateBody<T extends Record<string, unknown>>(body: unknown): body is T {
  return typeof body === "object" && body !== null && !Array.isArray(body);
}

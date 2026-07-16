import { NextRequest, NextResponse } from "next/server";
import { createCustomOrder } from "@/lib/api";
import { Category } from "@/lib/types";
import {
  applySecurityHeaders,
  checkRateLimit,
  sanitizeText,
  validateBody,
  validateCpf,
  validateEmail,
  validatePhone,
  isAllowedCategory,
} from "@/lib/security";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "orders", 20, 60_000);
  if (!rateLimit.ok) {
    const response = NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
    applySecurityHeaders(response);
    response.headers.set("Retry-After", String(rateLimit.retryAfter));
    return response;
  }

  try {
    const body = await request.json();
    if (!validateBody(body)) {
      const response = NextResponse.json({ error: "Payload inválido" }, { status: 400 });
      applySecurityHeaders(response);
      return response;
    }

    const customerName = sanitizeText(body.customerName);
    const customerEmail = sanitizeText(body.customerEmail);
    const customerPhone = sanitizeText(body.customerPhone);
    const customerCpf = sanitizeText(body.customerCpf);
    const description = sanitizeText(body.description);
    const category = body.category;

    if (!customerName || !customerEmail || !customerPhone || !customerCpf || !description || !isAllowedCategory(category)) {
      const response = NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      applySecurityHeaders(response);
      return response;
    }

    if (!validateEmail(customerEmail) || !validatePhone(customerPhone) || !validateCpf(customerCpf)) {
      const response = NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      applySecurityHeaders(response);
      return response;
    }

    const order = await createCustomOrder({
      customerName,
      customerEmail,
      customerPhone,
      customerCpf,
      description,
      category: category as Category,
    });
    const response = NextResponse.json(order);
    applySecurityHeaders(response);
    return response;
  } catch {
    const response = NextResponse.json({ error: "Erro ao criar encomenda" }, { status: 500 });
    applySecurityHeaders(response);
    return response;
  }
}

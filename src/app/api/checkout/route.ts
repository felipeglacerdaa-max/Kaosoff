import { NextRequest, NextResponse } from "next/server";
import { createCheckoutOrder } from "@/lib/api";
import { PaymentMethod } from "@/lib/types";
import { calculateShippingQuote } from "@/lib/shipping";
import {
  applySecurityHeaders,
  checkRateLimit,
  sanitizeText,
  validateBody,
  validateCpf,
  validateEmail,
  validatePhone,
} from "@/lib/security";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "checkout", 15, 60_000);
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
    const productId = sanitizeText(body.productId);
    const amount = Number(body.amount);
    const shippingZip = sanitizeText(body.shippingZip || body.cep);
    const shippingAddress = sanitizeText(body.shippingAddress);
    const shippingCity = sanitizeText(body.shippingCity);
    const shippingState = sanitizeText(body.shippingState);
    const paymentMethod = body.paymentMethod;

    if (!customerName || !customerEmail || !customerPhone || !customerCpf || !productId || Number.isNaN(amount) || !shippingZip || !shippingAddress || !shippingCity || !shippingState || !["pix", "card"].includes(paymentMethod as string)) {
      const response = NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      applySecurityHeaders(response);
      return response;
    }

    if (!validateEmail(customerEmail) || !validatePhone(customerPhone) || !validateCpf(customerCpf)) {
      const response = NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      applySecurityHeaders(response);
      return response;
    }

    const shippingQuote = await calculateShippingQuote(shippingZip, amount);
    const shippingAmount = Number(shippingQuote.amount.toFixed(2));
    const totalAmount = Number((amount + shippingAmount).toFixed(2));

    const order = await createCheckoutOrder({
      customerName,
      customerEmail,
      customerPhone,
      customerCpf,
      productId,
      amount,
      shippingAmount,
      totalAmount,
      shippingZip,
      shippingCity,
      shippingState,
      shippingAddress,
      paymentMethod: paymentMethod as PaymentMethod,
    });
    const response = NextResponse.json(order);
    applySecurityHeaders(response);
    return response;
  } catch {
    const response = NextResponse.json({ error: "Erro no checkout" }, { status: 500 });
    applySecurityHeaders(response);
    return response;
  }
}

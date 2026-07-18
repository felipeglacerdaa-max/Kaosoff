import { NextRequest, NextResponse } from "next/server";
import { calculateShippingQuote } from "@/lib/shipping";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const destinationZip = String(body?.destinationZip || "").trim();
    const productPrice = Number(body?.productPrice || 0);

    if (!destinationZip || Number.isNaN(productPrice)) {
      return NextResponse.json({ error: "Dados de frete inválidos" }, { status: 400 });
    }

    const quote = await calculateShippingQuote(destinationZip, productPrice);
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Não foi possível calcular o frete" }, { status: 500 });
  }
}

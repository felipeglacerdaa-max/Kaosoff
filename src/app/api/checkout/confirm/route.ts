import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    await confirmPayment(orderId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao confirmar" }, { status: 500 });
  }
}

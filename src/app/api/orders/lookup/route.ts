import { NextRequest, NextResponse } from "next/server";
import { findCustomOrder } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { cpf, orderNumber } = await request.json();
    const order = await findCustomOrder(cpf, orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Erro na consulta" }, { status: 500 });
  }
}

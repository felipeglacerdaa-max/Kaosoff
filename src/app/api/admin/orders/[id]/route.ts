import { NextRequest, NextResponse } from "next/server";
import { updateCustomOrderStatus } from "@/lib/api";
import { OrderStatus } from "@/lib/types";

function isAdmin(request: NextRequest) {
  return request.cookies.get("admin_token")?.value === "mock-admin-session";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await request.json();
  const order = await updateCustomOrderStatus(id, status as OrderStatus);
  return order
    ? NextResponse.json(order)
    : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}

import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct, markProductAsSold } from "@/lib/api";

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
  const body = await request.json();

  if (body.action === "mark_sold") {
    const product = await markProductAsSold(id);
    return product
      ? NextResponse.json(product)
      : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const product = await updateProduct(id, body);
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteProduct(id);
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}

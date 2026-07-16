import { NextRequest, NextResponse } from "next/server";
import { getCustomOrders } from "@/lib/api";

function isAdmin(request: NextRequest) {
  return request.cookies.get("admin_token")?.value === "mock-admin-session";
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const orders = await getCustomOrders();
  return NextResponse.json(orders);
}

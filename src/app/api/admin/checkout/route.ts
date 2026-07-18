import { NextRequest, NextResponse } from "next/server";
import { getCheckoutOrders } from "@/lib/api";
import { hasAdminSession } from "@/lib/security";

function isAdmin(request: NextRequest) {
  return hasAdminSession(request);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const orders = await getCheckoutOrders();
  return NextResponse.json(orders);
}

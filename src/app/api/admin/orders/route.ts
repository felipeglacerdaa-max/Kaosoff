import { NextRequest, NextResponse } from "next/server";
import { getCustomOrders } from "@/lib/api";
import { hasAdminSession } from "@/lib/security";

function isAdmin(request: NextRequest) {
  return hasAdminSession(request);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const orders = await getCustomOrders();
  return NextResponse.json(orders);
}

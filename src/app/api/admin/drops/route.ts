import { NextRequest, NextResponse } from "next/server";
import { getDrops, createDrop } from "@/lib/api";
import { hasAdminSession } from "@/lib/security";

function isAdmin(request: NextRequest) {
  return hasAdminSession(request);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const drops = await getDrops();
  return NextResponse.json(drops);
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const drop = await createDrop({
      name: body.name,
      description: body.description,
      launchDate: body.launchDate,
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&q=80",
      productIds: body.productIds || [],
      isActive: body.isActive ?? true,
    });
    return NextResponse.json(drop);
  } catch {
    return NextResponse.json({ error: "Erro ao criar drop" }, { status: 500 });
  }
}

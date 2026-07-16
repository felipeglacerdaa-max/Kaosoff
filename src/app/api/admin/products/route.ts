import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/api";
import { Category, ProductStatus } from "@/lib/types";

function isAdmin(request: NextRequest) {
  return request.cookies.get("admin_token")?.value === "mock-admin-session";
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const product = await createProduct({
      name: body.name,
      description: body.description,
      materials: body.materials,
      dimensions: body.dimensions,
      price: Number(body.price),
      category: body.category as Category,
      images: body.images || ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&q=80"],
      status: (body.status as ProductStatus) || "available",
      isUnique: true,
      isCustomOrder: false,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

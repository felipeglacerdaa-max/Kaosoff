import { getSupabaseClient } from "./supabase";
import { Product, Drop, CustomOrder, CheckoutOrder } from "./types";
import { generateOrderNumber, normalizeCpf } from "./utils";

const supabase = getSupabaseClient();

type SupabaseRow = Record<string, unknown>;

function getSupabaseOrNull() {
  return supabase;
}

function getString(row: SupabaseRow, field: string): string {
  const value = row[field];
  return typeof value === "string" ? value : "";
}

function getBoolean(row: SupabaseRow, field: string): boolean {
  const value = row[field];
  return typeof value === "boolean" ? value : Boolean(value);
}

function getNumber(row: SupabaseRow, field: string): number {
  const value = row[field];
  return typeof value === "number" ? value : Number(value || 0);
}

function getStringArray(row: SupabaseRow, field: string): string[] {
  const value = row[field];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapProductRow(row: SupabaseRow): Product {
  return {
    id: getString(row, "id"),
    slug: getString(row, "slug"),
    name: getString(row, "name"),
    description: getString(row, "description"),
    materials: getString(row, "materials"),
    dimensions: getString(row, "dimensions"),
    price: getNumber(row, "price"),
    originalPrice: getString(row, "original_price") ? Number(getString(row, "original_price")) : undefined,
    category: getString(row, "category") as Product["category"],
    images: getStringArray(row, "images"),
    status: getString(row, "status") as Product["status"],
    isUnique: getBoolean(row, "is_unique"),
    isCustomOrder: getBoolean(row, "is_custom_order"),
    dropId: getString(row, "drop_id") || undefined,
    availableAt: getString(row, "available_at") || undefined,
    createdAt: getString(row, "created_at"),
  };
}

function mapDropRow(row: SupabaseRow): Drop {
  return {
    id: getString(row, "id"),
    slug: getString(row, "slug"),
    name: getString(row, "name"),
    description: getString(row, "description"),
    launchDate: getString(row, "launch_date"),
    coverImage: getString(row, "cover_image"),
    productIds: getStringArray(row, "product_ids"),
    isActive: getBoolean(row, "is_active"),
  };
}

function mapOrderRow(row: SupabaseRow): CustomOrder {
  return {
    id: getString(row, "id"),
    orderNumber: getString(row, "order_number"),
    customerCpf: getString(row, "customer_cpf"),
    customerName: getString(row, "customer_name"),
    customerEmail: getString(row, "customer_email"),
    customerPhone: getString(row, "customer_phone"),
    description: getString(row, "description"),
    category: getString(row, "category") as CustomOrder["category"],
    status: getString(row, "status") as CustomOrder["status"],
    createdAt: getString(row, "created_at"),
    updatedAt: getString(row, "updated_at"),
  };
}

function mapCheckoutRow(row: SupabaseRow): CheckoutOrder {
  return {
    id: getString(row, "id"),
    orderNumber: getString(row, "order_number"),
    customerCpf: getString(row, "customer_cpf"),
    customerName: getString(row, "customer_name"),
    customerEmail: getString(row, "customer_email"),
    customerPhone: getString(row, "customer_phone"),
    productId: getString(row, "product_id"),
    amount: getNumber(row, "amount"),
    paymentMethod: getString(row, "payment_method") as CheckoutOrder["paymentMethod"],
    status: getString(row, "status") as CheckoutOrder["status"],
    createdAt: getString(row, "created_at"),
  };
}

export async function getProducts(): Promise<Product[]> {
  const client = getSupabaseOrNull();
  if (!client) {
    return [];
  }
  const { data, error } = await client.from("products").select("*").eq("is_custom_order", false).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const { data, error } = await client.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapProductRow(data) : null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getProducts();
  if (!category || category === "todos") return all;
  return all.filter((p) => p.category === category);
}

export async function getProductsByDrop(dropId: string): Promise<Product[]> {
  const client = getSupabaseOrNull();
  if (!client) {
    return [];
  }
  const { data, error } = await client.from("products").select("*").eq("drop_id", dropId).eq("is_custom_order", false).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProductRow);
}

export async function getDrops(): Promise<Drop[]> {
  const client = getSupabaseOrNull();
  if (!client) {
    return [];
  }
  const { data, error } = await client.from("drops").select("*").order("launch_date", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapDropRow);
}

export async function getDropBySlug(slug: string): Promise<Drop | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const { data, error } = await client.from("drops").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapDropRow(data) : null;
}

export async function getActiveDrop(): Promise<Drop | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const now = new Date().toISOString();
  const { data, error } = await client.from("drops").select("*").eq("is_active", true).lte("launch_date", now).order("launch_date", { ascending: false }).limit(1);
  if (error) throw error;
  return data?.[0] ? mapDropRow(data[0]) : null;
}

export async function getUpcomingDrop(): Promise<Drop | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const now = new Date().toISOString();
  const { data, error } = await client.from("drops").select("*").eq("is_active", true).gt("launch_date", now).order("launch_date", { ascending: true }).limit(1);
  if (error) throw error;
  return data?.[0] ? mapDropRow(data[0]) : null;
}

export async function getCustomOrders(): Promise<CustomOrder[]> {
  const client = getSupabaseOrNull();
  if (!client) {
    return [];
  }
  const { data, error } = await client.from("custom_orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOrderRow);
}

export async function findCustomOrder(cpf: string, orderNumber: string): Promise<CustomOrder | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const normalized = normalizeCpf(cpf);
  const { data, error } = await client.from("custom_orders").select("*").eq("customer_cpf", normalized).eq("order_number", orderNumber.toUpperCase()).maybeSingle();
  if (error) throw error;
  return data ? mapOrderRow(data) : null;
}

export async function createCustomOrder(data: Omit<CustomOrder, "id" | "orderNumber" | "status" | "createdAt" | "updatedAt">): Promise<CustomOrder> {
  const client = getSupabaseOrNull();
  if (!client) {
    return {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerCpf: normalizeCpf(data.customerCpf),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      description: data.description,
      category: data.category,
      status: "received",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  const order = {
    id: `order-${Date.now()}`,
    order_number: generateOrderNumber(),
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    customer_cpf: normalizeCpf(data.customerCpf),
    description: data.description,
    category: data.category,
    status: "received",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data: inserted, error } = await client.from("custom_orders").insert(order).select("*").single();
  if (error) throw error;
  return mapOrderRow(inserted);
}

export async function updateCustomOrderStatus(id: string, status: CustomOrder["status"]): Promise<CustomOrder | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const { data, error } = await client.from("custom_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("*").maybeSingle();
  if (error) throw error;
  return data ? mapOrderRow(data) : null;
}

export async function createProduct(data: Omit<Product, "id" | "slug" | "createdAt">): Promise<Product> {
  const client = getSupabaseOrNull();
  if (!client) {
    return {
      id: `prod-${Date.now()}`,
      slug: data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      name: data.name,
      description: data.description,
      materials: data.materials,
      dimensions: data.dimensions,
      price: data.price,
      originalPrice: data.originalPrice,
      category: data.category,
      images: data.images,
      status: data.status,
      isUnique: data.isUnique,
      isCustomOrder: data.isCustomOrder,
      dropId: data.dropId,
      availableAt: data.availableAt,
      createdAt: new Date().toISOString(),
    };
  }
  const product = {
    id: `prod-${Date.now()}`,
    slug: data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
    name: data.name,
    description: data.description,
    materials: data.materials,
    dimensions: data.dimensions,
    price: data.price,
    original_price: data.originalPrice || null,
    category: data.category,
    images: data.images,
    status: data.status,
    is_unique: data.isUnique,
    is_custom_order: data.isCustomOrder,
    drop_id: data.dropId || null,
    available_at: data.availableAt || null,
    created_at: new Date().toISOString(),
  };
  const { data: inserted, error } = await client.from("products").insert(product).select("*").single();
  if (error) throw error;
  return mapProductRow(inserted);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const updatePayload: Record<string, unknown> = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.materials !== undefined) updatePayload.materials = data.materials;
  if (data.dimensions !== undefined) updatePayload.dimensions = data.dimensions;
  if (data.price !== undefined) updatePayload.price = data.price;
  if (data.originalPrice !== undefined) updatePayload.original_price = data.originalPrice;
  if (data.category !== undefined) updatePayload.category = data.category;
  if (data.images !== undefined) updatePayload.images = data.images;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.isUnique !== undefined) updatePayload.is_unique = data.isUnique;
  if (data.isCustomOrder !== undefined) updatePayload.is_custom_order = data.isCustomOrder;
  if (data.dropId !== undefined) updatePayload.drop_id = data.dropId;
  if (data.availableAt !== undefined) updatePayload.available_at = data.availableAt;
  const { data: updated, error } = await client.from("products").update(updatePayload).eq("id", id).select("*").maybeSingle();
  if (error) throw error;
  return updated ? mapProductRow(updated) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const client = getSupabaseOrNull();
  if (!client) {
    return false;
  }
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function markProductAsSold(id: string): Promise<Product | null> {
  return updateProduct(id, { status: "sold" });
}

export async function createDrop(data: Omit<Drop, "id" | "slug">): Promise<Drop> {
  const client = getSupabaseOrNull();
  if (!client) {
    return {
      id: `drop-${Date.now()}`,
      slug: data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      name: data.name,
      description: data.description,
      launchDate: data.launchDate,
      coverImage: data.coverImage,
      productIds: data.productIds,
      isActive: data.isActive,
    };
  }
  const drop = {
    id: `drop-${Date.now()}`,
    slug: data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
    name: data.name,
    description: data.description,
    launch_date: data.launchDate,
    cover_image: data.coverImage,
    product_ids: data.productIds,
    is_active: data.isActive,
  };
  const { data: inserted, error } = await client.from("drops").insert(drop).select("*").single();
  if (error) throw error;
  return mapDropRow(inserted);
}

export async function updateDrop(id: string, data: Partial<Drop>): Promise<Drop | null> {
  const client = getSupabaseOrNull();
  if (!client) {
    return null;
  }
  const updatePayload: Record<string, unknown> = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.launchDate !== undefined) updatePayload.launch_date = data.launchDate;
  if (data.coverImage !== undefined) updatePayload.cover_image = data.coverImage;
  if (data.productIds !== undefined) updatePayload.product_ids = data.productIds;
  if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
  const { data: updated, error } = await client.from("drops").update(updatePayload).eq("id", id).select("*").maybeSingle();
  if (error) throw error;
  return updated ? mapDropRow(updated) : null;
}

export async function deleteDrop(id: string): Promise<boolean> {
  const client = getSupabaseOrNull();
  if (!client) {
    return false;
  }
  const { error } = await client.from("drops").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createCheckoutOrder(data: Omit<CheckoutOrder, "id" | "orderNumber" | "status" | "createdAt">): Promise<CheckoutOrder> {
  const client = getSupabaseOrNull();
  if (!client) {
    return {
      id: `checkout-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerCpf: normalizeCpf(data.customerCpf),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      productId: data.productId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  }
  const order = {
    id: `checkout-${Date.now()}`,
    order_number: generateOrderNumber(),
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    customer_cpf: normalizeCpf(data.customerCpf),
    product_id: data.productId,
    amount: data.amount,
    payment_method: data.paymentMethod,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  const { data: inserted, error } = await client.from("checkout_orders").insert(order).select("*").single();
  if (error) throw error;
  return mapCheckoutRow(inserted);
}

export async function confirmPayment(orderId: string): Promise<void> {
  const client = getSupabaseOrNull();
  if (!client) {
    return;
  }
  const { error } = await client.from("checkout_orders").update({ status: "paid" }).eq("id", orderId);
  if (error) throw error;
  const { data: order, error: orderError } = await client.from("checkout_orders").select("*").eq("id", orderId).maybeSingle();
  if (orderError) throw orderError;
  if (order?.product_id) {
    await markProductAsSold(order.product_id);
  }
}

export async function getCheckoutOrders(): Promise<CheckoutOrder[]> {
  const client = getSupabaseOrNull();
  if (!client) {
    return [];
  }
  const { data, error } = await client.from("checkout_orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapCheckoutRow);
}

export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  const client = getSupabaseOrNull();
  if (!client) {
    return false;
  }
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return false;
  return Boolean(data.session);
}

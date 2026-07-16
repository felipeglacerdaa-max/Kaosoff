import { Product, Drop, CustomOrder } from "./types";

export function formatPrice(price: number): string {
  if (price === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function canPurchase(product: Product): boolean {
  if (product.status === "sold" || product.status === "reserved") return false;
  if (product.isCustomOrder) return false;
  if (product.availableAt && new Date(product.availableAt) > new Date())
    return false;
  return true;
}

export function isDropUpcoming(drop: Drop): boolean {
  return new Date(drop.launchDate) > new Date();
}

export function isDropPast(drop: Drop): boolean {
  return new Date(drop.launchDate) <= new Date();
}

export function getTimeRemaining(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `KAO-${year}-${num}`;
}

export function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function getOrderStatusIndex(status: CustomOrder["status"]): number {
  const steps = ["received", "in_production", "finished", "shipped"];
  return steps.indexOf(status);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getWhatsAppUrl(
  phone: string,
  message: string,
  productName?: string
): string {
  const msg = productName
    ? `${message} Estou interessado(a) na peça: ${productName}.`
    : message;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export function sortProducts(
  items: Product[],
  sort: SortOption
): Product[] {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function getDiscountPercent(
  price: number,
  originalPrice?: number
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

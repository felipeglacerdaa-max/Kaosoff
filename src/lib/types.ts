export type Category =
  | "ceramica"
  | "croche"
  | "macrame"
  | "chapeus"
  | "balaclavas"
  | "amigurumi";

export type ProductStatus = "available" | "sold" | "reserved";

export type OrderStatus =
  | "received"
  | "in_production"
  | "finished"
  | "shipped";

export type PaymentMethod = "pix" | "card" | "boleto";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  materials: string;
  dimensions: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  status: ProductStatus;
  isUnique: boolean;
  isCustomOrder: boolean;
  dropId?: string;
  availableAt?: string;
  createdAt: string;
}

export interface Drop {
  id: string;
  slug: string;
  name: string;
  description: string;
  launchDate: string;
  coverImage: string;
  productIds: string[];
  isActive: boolean;
}

export interface CustomOrder {
  id: string;
  orderNumber: string;
  customerCpf: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  category: Category;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: 1;
}

export interface CheckoutOrder {
  id: string;
  orderNumber: string;
  customerCpf: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  ceramica: "Cerâmica",
  croche: "Crochê",
  macrame: "Macramê",
  chapeus: "Chapéus",
  balaclavas: "Balaclavas",
  amigurumi: "Amigurumi",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Recebido",
  in_production: "Em produção",
  finished: "Finalizado",
  shipped: "Enviado",
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "received",
  "in_production",
  "finished",
  "shipped",
];

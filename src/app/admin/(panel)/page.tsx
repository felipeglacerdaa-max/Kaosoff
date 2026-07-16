"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    available: 0,
    sold: 0,
    drops: 0,
    orders: 0,
    payments: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/drops").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
      fetch("/api/admin/checkout").then((r) => r.json()),
    ]).then(([products, drops, orders, payments]) => {
      setStats({
        products: products.length,
        available: products.filter((p: Product) => p.status === "available")
          .length,
        sold: products.filter((p: Product) => p.status === "sold").length,
        drops: drops.length,
        orders: orders.length,
        payments: payments.length,
      });
    });
  }, []);

  const cards = [
    { label: "Produtos", value: stats.products, href: "/admin/produtos" },
    { label: "Disponíveis", value: stats.available, href: "/admin/produtos" },
    { label: "Vendidos", value: stats.sold, href: "/admin/produtos" },
    { label: "Drops", value: stats.drops, href: "/admin/drops" },
    { label: "Encomendas", value: stats.orders, href: "/admin/encomendas" },
    { label: "Pagamentos", value: stats.payments, href: "/admin/pagamentos" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl tracking-wide mb-2">Dashboard</h1>
      <p className="text-sm text-ash mb-10">
        Visão geral da loja Kaosoff.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-smoke p-6 hover:bg-mist transition-colors"
          >
            <p className="text-[10px] tracking-widest uppercase text-ash">
              {card.label}
            </p>
            <p className="font-display text-3xl mt-2">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

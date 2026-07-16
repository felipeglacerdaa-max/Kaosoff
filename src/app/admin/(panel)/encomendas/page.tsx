"use client";

import { useEffect, useState } from "react";
import { CustomOrder, OrderStatus } from "@/lib/types";
import {
  CATEGORY_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { OrderStepper } from "@/components/ui/OrderStepper";
import { Select } from "@/components/ui/Select";

export default function AdminEncomendasPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [selected, setSelected] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-wide mb-2">Encomendas</h1>
      <p className="text-sm text-ash mb-10">
        Gerencie pedidos personalizados e atualize o status de produção.
      </p>

      {loading ? (
        <p className="text-sm text-ash">Carregando...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className={`w-full text-left border p-4 transition-colors ${
                  selected?.id === order.id
                    ? "border-ink bg-mist"
                    : "border-smoke hover:bg-mist/50"
                }`}
              >
                <p className="text-sm font-medium">{order.orderNumber}</p>
                <p className="text-xs text-ash mt-1">
                  {order.customerName} ·{" "}
                  {CATEGORY_LABELS[order.category]}
                </p>
                <p className="text-xs text-ash mt-1">
                  {ORDER_STATUS_LABELS[order.status]}
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="border border-smoke p-6 space-y-6">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-ash">
                  {selected.orderNumber}
                </p>
                <p className="text-sm mt-2">{selected.description}</p>
                <dl className="mt-4 space-y-2 text-xs text-ash">
                  <div>
                    <span className="text-ink">{selected.customerName}</span> ·{" "}
                    {selected.customerEmail}
                  </div>
                  <div>{selected.customerPhone}</div>
                  <div>Solicitado em {formatDate(selected.createdAt)}</div>
                </dl>
              </div>

              <OrderStepper currentStatus={selected.status} />

              <Select
                label="Atualizar status"
                value={selected.status}
                onChange={(e) =>
                  updateStatus(selected.id, e.target.value as OrderStatus)
                }
                options={ORDER_STATUS_STEPS.map((s) => ({
                  value: s,
                  label: ORDER_STATUS_LABELS[s],
                }))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

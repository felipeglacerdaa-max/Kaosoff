"use client";

import { useEffect, useState } from "react";
import { CheckoutOrder } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const STATUS_LABELS: Record<CheckoutOrder["status"], string> = {
  pending: "Pendente",
  paid: "Pago",
  cancelled: "Cancelado",
};

export default function AdminPagamentosPage() {
  const [payments, setPayments] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/checkout")
      .then((r) => r.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl tracking-wide mb-2">Pagamentos</h1>
      <p className="text-sm text-ash mb-10">
        Pedidos de checkout e status de pagamento.
        {/* TODO: Integrar com webhook do gateway (Mercado Pago / Stripe) */}
      </p>

      {loading ? (
        <p className="text-sm text-ash">Carregando...</p>
      ) : payments.length === 0 ? (
        <p className="text-sm text-ash bg-mist p-8 text-center">
          Nenhum pagamento registrado ainda. Os pedidos aparecerão aqui após
          checkout.
        </p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between border border-smoke p-4 gap-4"
            >
              <div>
                <p className="text-sm font-medium">{payment.orderNumber}</p>
                <p className="text-xs text-ash mt-1">
                  {payment.customerName} · {payment.customerEmail}
                </p>
                <p className="text-xs text-ash mt-1">
                  {formatDate(payment.createdAt)} · {payment.paymentMethod.toUpperCase()}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm">{formatPrice(payment.amount)}</p>
                <Badge
                  variant={payment.status === "paid" ? "unique" : "sold"}
                  className="mt-2"
                >
                  {STATUS_LABELS[payment.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

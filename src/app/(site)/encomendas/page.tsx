"use client";

import { useState, FormEvent } from "react";
import { CATEGORIES } from "@/lib/mock-data";
import { CATEGORY_LABELS, CustomOrder } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OrderStepper } from "@/components/ui/OrderStepper";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function EncomendasPage() {
  const [activeTab, setActiveTab] = useState<"solicitar" | "consultar">("solicitar");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<CustomOrder | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("nome"),
          customerEmail: form.get("email"),
          customerPhone: form.get("telefone"),
          customerCpf: form.get("cpf"),
          description: form.get("descricao"),
          category: form.get("categoria"),
        }),
      });
      if (!res.ok) throw new Error();
      const order = await res.json();
      setSuccess(
        `Encomenda recebida! Seu número de pedido é ${order.orderNumber}. Guarde-o para consultar o status.`
      );
      e.currentTarget.reset();
    } catch {
      setError("Erro ao enviar encomenda. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFoundOrder(null);

    const form = new FormData(e.currentTarget);
    const cpf = form.get("cpf-consulta") as string;
    const orderNumber = form.get("pedido") as string;

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, orderNumber }),
      });
      if (!res.ok) {
        setError("Pedido não encontrado. Verifique o CPF e o número do pedido.");
        return;
      }
      const order = await res.json();
      setFoundOrder(order);
    } catch {
      setError("Erro ao consultar pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <SectionHeading
        title="Encomendas"
        subtitle="Solicite uma peça personalizada ou consulte o status do seu pedido."
      />

      <div className="flex gap-6 mb-12 border-b border-smoke">
        {(["solicitar", "consultar"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setError(null);
              setSuccess(null);
              setFoundOrder(null);
            }}
            className={`pb-3 text-xs tracking-widest uppercase font-display border-b-2 transition-colors ${
              activeTab === tab
                ? "border-ink text-ink"
                : "border-transparent text-ash hover:text-ink"
            }`}
          >
            {tab === "solicitar" ? "Solicitar" : "Consultar status"}
          </button>
        ))}
      </div>

      {activeTab === "solicitar" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="nome" label="Nome completo" required />
          <Input name="email" label="E-mail" type="email" required />
          <Input name="telefone" label="Telefone" type="tel" required />
          <Input name="cpf" label="CPF" required placeholder="000.000.000-00" />
          <Select
            name="categoria"
            label="Categoria"
            required
            options={CATEGORIES.map((c) => ({
              value: c,
              label: CATEGORY_LABELS[c],
            }))}
          />
          <Textarea
            name="descricao"
            label="Descreva a peça desejada"
            required
            placeholder="Materiais, cores, tamanho, referências..."
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-ink bg-mist p-4">{success}</p>}

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Enviando..." : "Enviar solicitação"}
          </Button>
        </form>
      )}

      {activeTab === "consultar" && (
        <div className="space-y-10">
          <form onSubmit={handleLookup} className="space-y-6">
            <Input
              name="cpf-consulta"
              label="CPF"
              required
              placeholder="000.000.000-00"
            />
            <Input
              name="pedido"
              label="Número do pedido"
              required
              placeholder="KAO-2026-0000"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? "Consultando..." : "Consultar"}
            </Button>
          </form>

          {foundOrder && (
            <div className="border border-smoke p-6 md:p-8 space-y-8">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-ash">
                  Pedido {foundOrder.orderNumber}
                </p>
                <p className="mt-1 text-sm">
                  {foundOrder.description}
                </p>
                <p className="mt-2 text-xs text-ash">
                  Solicitado em {formatDate(foundOrder.createdAt)}
                </p>
              </div>

              <OrderStepper currentStatus={foundOrder.status} />

              <p className="text-sm text-center text-ash">
                Status atual:{" "}
                <strong>{ORDER_STATUS_LABELS[foundOrder.status]}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

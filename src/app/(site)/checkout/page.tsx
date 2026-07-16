"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import { Product, PaymentMethod } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("produto");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!productSlug) {
      setLoading(false);
      return;
    }
    getProductBySlug(productSlug).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [productSlug]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    // TODO: Integrar com gateway de pagamento real
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("nome"),
        customerEmail: form.get("email"),
        customerPhone: form.get("telefone"),
        customerCpf: form.get("cpf"),
        productId: product.id,
        amount: product.price,
        paymentMethod,
      }),
    });
    const order = await res.json();

    setOrderId(order.id);
    setStep("payment");
    setSubmitting(false);
  }

  async function handleConfirmPayment() {
    if (!orderId) return;
    // Simula confirmação — em produção, viria do webhook do gateway
    await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    setStep("done");
  }

  if (loading) {
    return <p className="text-sm text-ash py-20 text-center">Carregando...</p>;
  }

  if (!product) {
    return (
      <p className="text-sm text-ash py-20 text-center">
        Produto não encontrado.{" "}
        <Link href="/produtos" className="underline">
          Voltar ao catálogo
        </Link>
      </p>
    );
  }

  if (step === "done") {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="font-display text-2xl tracking-wide">
          Pagamento confirmado
        </h2>
        <p className="text-sm text-ash">
          Obrigado pela compra de <strong>{product.name}</strong>. Você receberá
          um e-mail com os detalhes do envio.
        </p>
        <Link
          href="/produtos"
          className="inline-block mt-6 text-xs tracking-widest uppercase border-b border-ink pb-1"
        >
          Continuar navegando
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 md:gap-20">
      <div className="flex gap-4 items-start">
        <div className="relative w-24 h-32 bg-mist flex-shrink-0 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div>
          <h2 className="font-display text-lg tracking-wide">{product.name}</h2>
          <p className="text-sm text-ash mt-1">Peça única</p>
          <p className="text-lg mt-3">{formatPrice(product.price)}</p>
        </div>
      </div>

      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="nome" label="Nome completo" required />
          <Input name="email" label="E-mail" type="email" required />
          <Input name="telefone" label="Telefone" type="tel" required />
          <Input name="cpf" label="CPF" required />

          <fieldset>
            <legend className="text-xs tracking-widest uppercase text-ash font-display mb-3">
              Forma de pagamento
            </legend>
            <div className="space-y-2">
              {(
                [
                  { value: "pix", label: "Pix" },
                  { value: "card", label: "Cartão de crédito" },
                  { value: "boleto", label: "Boleto (em breve)" },
                ] as const
              ).map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? "border-ink bg-mist"
                      : "border-smoke hover:border-ash"
                  } ${method.value === "boleto" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() =>
                      method.value !== "boleto" && setPaymentMethod(method.value)
                    }
                    disabled={method.value === "boleto"}
                    className="accent-ink"
                  />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Processando..." : `Pagar ${formatPrice(product.price)}`}
          </Button>

          <p className="text-[10px] text-ash leading-relaxed">
            Pagamento processado de forma segura. Integração com gateway
            (Mercado Pago / Stripe / Pagar.me) será ativada em produção.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          {paymentMethod === "pix" && (
            <div className="border border-smoke p-6 text-center space-y-4">
              <p className="text-xs tracking-widest uppercase text-ash">
                QR Code Pix (simulado)
              </p>
              <div className="w-48 h-48 bg-mist mx-auto flex items-center justify-center text-ash text-xs">
                QR Code
              </div>
              <p className="text-sm">
                Valor: <strong>{formatPrice(product.price)}</strong>
              </p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="border border-smoke p-6 space-y-4">
              <p className="text-xs tracking-widest uppercase text-ash">
                Cartão de crédito (simulado)
              </p>
              <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Validade" placeholder="MM/AA" />
                <Input label="CVV" placeholder="000" />
              </div>
            </div>
          )}

          <Button onClick={handleConfirmPayment} className="w-full">
            Confirmar pagamento (simulado)
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <SectionHeading title="Checkout" />
      <Suspense fallback={<p className="text-sm text-ash">Carregando...</p>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}

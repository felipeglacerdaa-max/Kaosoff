"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  const [shippingZip, setShippingZip] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingAmount, setShippingAmount] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingQuoteLabel, setShippingQuoteLabel] = useState("Digite o CEP para calcular o frete");

  useEffect(() => {
    if (!productSlug) {
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productSlug}`);
        if (!response.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productSlug]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const normalizedZip = shippingZip.replace(/\D/g, "");
    if (normalizedZip.length !== 8) {
      setShippingAmount(0);
      setShippingQuoteLabel("Digite o CEP para calcular o frete");
      setShippingLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setShippingLoading(true);
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationZip: normalizedZip, productPrice: product.price }),
          signal: controller.signal,
        });
        const quote = await response.json();
        const safeAmount = Number(quote?.amount ?? 0);
        const safeDeadline = Number(quote?.deadline ?? 0);
        setShippingAmount(Number(safeAmount.toFixed(2)));
        setShippingQuoteLabel(
          `Frete estimado: ${formatPrice(safeAmount)} · prazo ${safeDeadline || 5} dias`
        );
      } catch {
        setShippingAmount(0);
        setShippingQuoteLabel("Frete indisponível no momento. Tente novamente em instantes.");
      } finally {
        window.clearTimeout(timer);
        setShippingLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [product, shippingZip]);

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
        shippingZip,
        shippingAddress,
        shippingCity,
        shippingState,
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
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
      <div className="rounded-[1.25rem] border border-smoke/70 bg-paper/90 p-4 shadow-sm sm:p-5">
        <div className="flex items-start gap-3">
          <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-mist">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base tracking-wide">{product.name}</h2>
            <p className="mt-1 text-sm text-ash">Peça única</p>
            <p className="mt-3 text-lg font-medium">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-smoke/70 bg-mist/60 p-3 text-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ash">Resumo</p>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Produto</span>
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Frete</span>
              <span>{shippingLoading ? "Calculando..." : formatPrice(shippingAmount)}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(product.price + shippingAmount)}</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ash">{shippingQuoteLabel}</p>
        </div>
      </div>

      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.25rem] border border-smoke/70 bg-paper/90 p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="nome" label="Nome completo" required />
            <Input name="email" label="E-mail" type="email" required />
            <Input name="telefone" label="Telefone" type="tel" required />
            <Input name="cpf" label="CPF" required />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              name="cep"
              label="CEP"
              placeholder="31270-000"
              maxLength={9}
              value={shippingZip}
              onChange={(event) => setShippingZip(event.target.value)}
              required
            />
            <Input
              name="cidade"
              label="Cidade"
              value={shippingCity}
              onChange={(event) => setShippingCity(event.target.value)}
              required
            />
          </div>
          <Input
            name="endereco"
            label="Endereço completo"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            required
          />
          <Input
            name="estado"
            label="Estado"
            value={shippingState}
            onChange={(event) => setShippingState(event.target.value)}
            required
          />

          <fieldset>
            <legend className="mb-2 text-[10px] uppercase tracking-[0.3em] text-ash">
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
                  className={`flex items-center gap-3 rounded-lg border p-2.5 text-sm transition-colors ${
                    paymentMethod === method.value
                      ? "border-ink bg-mist"
                      : "border-smoke hover:border-ash"
                  } ${method.value === "boleto" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Processando..." : `Pagar ${formatPrice(product.price + shippingAmount)}`}
          </Button>

          <p className="text-[10px] leading-relaxed text-ash">
            Pagamento processado de forma segura. Integração com gateway
            (Mercado Pago / Stripe / Pagar.me) será ativada em produção.
          </p>
        </form>
      ) : (
        <div className="space-y-4 rounded-[1.25rem] border border-smoke/70 bg-paper/90 p-4 shadow-sm sm:p-5">
          {paymentMethod === "pix" && (
            <div className="rounded-xl border border-smoke p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
                QR Code Pix (simulado)
              </p>
              <div className="mx-auto mt-3 flex h-40 w-40 items-center justify-center rounded-lg bg-mist text-xs text-ash">
                QR Code
              </div>
              <p className="mt-3 text-sm">
                Valor: <strong>{formatPrice(product.price + shippingAmount)}</strong>
              </p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-3 rounded-xl border border-smoke p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
                Cartão de crédito (simulado)
              </p>
              <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
              <div className="grid gap-3 sm:grid-cols-2">
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <SectionHeading title="Checkout" />
      <Suspense fallback={<p className="text-sm text-ash">Carregando...</p>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}

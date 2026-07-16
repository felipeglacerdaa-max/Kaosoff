"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { Product, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2, CheckCircle } from "lucide-react";

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        materials: form.get("materials"),
        dimensions: form.get("dimensions"),
        price: form.get("price"),
        category: form.get("category"),
      }),
    });
    setShowForm(false);
    loadProducts();
    e.currentTarget.reset();
  }

  async function markSold(id: string) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_sold" }),
    });
    loadProducts();
  }

  async function removeProduct(id: string) {
    if (!confirm("Remover este produto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Produtos</h1>
          <p className="text-sm text-ash mt-1">
            Gerencie o catálogo e marque peças como vendidas.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-2" />
          Novo produto
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-smoke p-6 mb-10 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="name" label="Nome" required />
            <Select
              name="category"
              label="Categoria"
              required
              options={CATEGORIES.map((c) => ({
                value: c,
                label: CATEGORY_LABELS[c as Category],
              }))}
            />
            <Input name="price" label="Preço (R$)" type="number" required />
            <Input name="materials" label="Materiais" required />
            <Input name="dimensions" label="Dimensões" required />
          </div>
          <Textarea name="description" label="Descrição" required />
          <div className="flex gap-3">
            <Button type="submit" size="sm">
              Criar produto
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ash">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 border border-smoke p-4"
            >
              <div className="relative w-14 h-18 bg-mist flex-shrink-0 overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-ash">
                  {CATEGORY_LABELS[product.category]} ·{" "}
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {product.status === "sold" ? (
                  <Badge variant="sold">Vendido</Badge>
                ) : (
                  <Badge variant="unique">Disponível</Badge>
                )}
                {product.status !== "sold" && (
                  <button
                    onClick={() => markSold(product.id)}
                    className="p-2 hover:bg-mist transition-colors"
                    title="Marcar como vendido"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-2 hover:bg-mist transition-colors text-ash"
                  title="Remover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

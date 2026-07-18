"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState("Nenhuma foto anexada");

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const normalizedProducts = Array.isArray(data)
        ? data.filter((item: Product | null | undefined) => item && typeof item === "object")
        : [];
      setProducts(normalizedProducts);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
        setSelectedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          materials: form.get("materials"),
          dimensions: form.get("dimensions"),
          price: form.get("price"),
          category: form.get("category"),
          images: selectedImage ? [selectedImage] : undefined,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        console.error("Erro ao criar produto", payload);
        return;
      }
    } catch (error) {
      console.error("Falha ao criar produto", error);
      return;
    }

    setShowForm(false);
    setSelectedImage(null);
    setSelectedImageName("Nenhuma foto anexada");
    e.currentTarget.reset();
    await loadProducts();
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
          <div className="border border-dashed border-smoke p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Foto do produto</p>
                <p className="text-xs text-ash">{selectedImageName}</p>
              </div>
              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageSelect}
                />
                <span className="inline-flex items-center justify-center rounded-none border border-ink/20 bg-ink px-4 py-2 text-[10px] tracking-[0.35em] uppercase text-paper transition-all duration-300 hover:bg-charcoal">
                  Anexar foto
                </span>
              </label>
            </div>
            {selectedImage && (
              <div className="relative h-40 w-full overflow-hidden border border-smoke bg-mist">
                <img
                  src={selectedImage}
                  alt="Preview da foto"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
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
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&q=80"}
                  alt={product.name || "Produto"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&q=80";
                  }}
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

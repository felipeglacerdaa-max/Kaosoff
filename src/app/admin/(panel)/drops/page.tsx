"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Drop } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
  const [selectedCoverImageName, setSelectedCoverImageName] = useState("Nenhuma foto anexada");

  async function loadDrops() {
    const res = await fetch("/api/admin/drops");
    const data = await res.json();
    setDrops(data);
    setLoading(false);
  }

  useEffect(() => {
    loadDrops();
  }, []);

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedCoverImage(reader.result);
        setSelectedCoverImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/admin/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        launchDate: new Date(form.get("launchDate") as string).toISOString(),
        isActive: form.get("isActive") === "true",
        coverImage: selectedCoverImage || undefined,
      }),
    });
    setShowForm(false);
    setSelectedCoverImage(null);
    setSelectedCoverImageName("Nenhuma foto anexada");
    loadDrops();
    e.currentTarget.reset();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/drops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadDrops();
  }

  async function removeDrop(id: string) {
    if (!confirm("Remover este drop?")) return;
    await fetch(`/api/admin/drops/${id}`, { method: "DELETE" });
    loadDrops();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Drops</h1>
          <p className="text-sm text-ash mt-1">
            Crie e gerencie coleções com data de lançamento.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-2" />
          Novo drop
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-smoke p-6 mb-10 space-y-4"
        >
          <Input name="name" label="Nome da coleção" required />
          <Textarea name="description" label="Descrição" required />
          <Input
            name="launchDate"
            label="Data e hora de lançamento"
            type="datetime-local"
            required
          />
          <div className="border border-dashed border-smoke p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Foto da coleção</p>
                <p className="text-xs text-ash">{selectedCoverImageName}</p>
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
            {selectedCoverImage && (
              <div className="relative h-40 w-full overflow-hidden border border-smoke bg-mist">
                <img
                  src={selectedCoverImage}
                  alt="Preview da foto"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked
              className="accent-ink"
            />
            Coleção ativa
          </label>
          <div className="flex gap-3">
            <Button type="submit" size="sm">
              Criar drop
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
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="flex items-center justify-between border border-smoke p-4 gap-4"
            >
              <div>
                <p className="text-sm font-medium">{drop.name}</p>
                <p className="text-xs text-ash mt-1">
                  Lançamento: {formatDateTime(drop.launchDate)} ·{" "}
                  {drop.productIds.length} produto(s)
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={drop.isActive ? "unique" : "sold"}>
                  {drop.isActive ? "Ativo" : "Inativo"}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleActive(drop.id, drop.isActive)}
                >
                  {drop.isActive ? "Desativar" : "Ativar"}
                </Button>
                <button
                  onClick={() => removeDrop(drop.id)}
                  className="p-2 hover:bg-mist transition-colors text-ash"
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

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/mock-data";
import { CATEGORY_LABELS, Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria") || "todos";

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "todos") {
      params.delete("categoria");
    } else {
      params.set("categoria", cat);
    }
    router.push(`/produtos?${params.toString()}`);
  }

  const items = [
    { value: "todos", label: "Todos" },
    ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c as Category] })),
  ];

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Filtrar por categoria">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => setCategory(item.value)}
          className={cn(
            "text-xs tracking-widest uppercase font-display pb-1 border-b-2 transition-colors duration-300",
            active === item.value
              ? "border-ink text-ink"
              : "border-transparent text-ash hover:text-ink"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

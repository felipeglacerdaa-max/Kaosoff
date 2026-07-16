"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SortOption } from "@/lib/utils";
import { Select } from "@/components/ui/Select";

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get("ordenar") as SortOption) || "newest";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ordenar", value);
    router.push(`/produtos?${params.toString()}`);
  }

  return (
    <Select
      label="Ordenar"
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      options={[
        { value: "newest", label: "Mais recentes" },
        { value: "price-asc", label: "Menor preço" },
        { value: "price-desc", label: "Maior preço" },
      ]}
      className="max-w-[200px]"
    />
  );
}

import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts } from "@/lib/api";
import { sortProducts, SortOption } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductSort } from "@/components/product/ProductSort";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo de peças artesanais únicas — cerâmica, crochê, macramê, chapéus, balaclavas e amigurumi.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; ordenar?: string }>;
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.categoria || "todos";
  const sort = (params.ordenar as SortOption) || "newest";

  const allProducts = await getProducts();
  const filtered =
    category === "todos"
      ? allProducts
      : allProducts.filter((p) => p.category === category);
  const products = sortProducts(filtered, sort);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <SectionHeading
        title="Produtos"
        subtitle="Cada peça é única. Quando vendida, é marcada como esgotada e sai de circulação."
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Suspense fallback={<div className="h-8" />}>
          <CategoryFilter />
        </Suspense>
        <Suspense fallback={<div className="h-12" />}>
          <ProductSort />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-ash py-20 text-center">
          Nenhuma peça encontrada nesta categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

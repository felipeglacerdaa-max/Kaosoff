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
    <div className="px-6 py-12 md:px-8 md:py-20">
      <section className="mx-auto mb-12 max-w-7xl rounded-[2rem] border border-smoke/80 bg-gradient-to-br from-paper via-mist/60 to-paper px-6 py-10 shadow-[0_20px_80px_rgba(20,17,15,0.06)] md:px-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Catálogo</p>
            <h1 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">
              Coleção de peças artesanais e exclusivas.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
              Cada peça é criada para ficar em circulação por tempo limitado e permanecer singular.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-smoke/70 bg-paper/90 p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Na coleção</p>
            <p className="mt-3 font-display text-2xl tracking-wide">{products.length} peças</p>
            <p className="mt-2 text-sm text-ash">Com acabamento manual e edição cuidadosa.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Produtos"
          subtitle="Cada peça é única. Quando vendida, é marcada como esgotada e sai de circulação."
        />

        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Suspense fallback={<div className="h-8" />}>
            <CategoryFilter />
          </Suspense>
          <Suspense fallback={<div className="h-12" />}>
            <ProductSort />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-ash">
            Nenhuma peça encontrada nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

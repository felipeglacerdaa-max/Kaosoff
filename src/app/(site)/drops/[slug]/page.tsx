import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDropBySlug, getProductsByDrop } from "@/lib/api";
import { formatDateTime, isDropUpcoming } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const drop = await getDropBySlug(slug);
  if (!drop) return { title: "Drop não encontrado" };
  return {
    title: drop.name,
    description: drop.description,
    openGraph: { images: [drop.coverImage] },
  };
}

export default async function DropPage({ params }: PageProps) {
  const { slug } = await params;
  const drop = await getDropBySlug(slug);
  if (!drop) notFound();

  const products = await getProductsByDrop(drop.id);
  const upcoming = isDropUpcoming(drop);

  return (
    <>
      <section className="relative flex min-h-[56vh] items-end overflow-hidden border-b border-smoke/70">
        <Image
          src={drop.coverImage}
          alt={drop.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl rounded-[1.5rem] border border-paper/40 bg-paper/70 p-6 backdrop-blur-sm md:p-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">
              {formatDateTime(drop.launchDate)}
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-wide md:text-5xl">
              {drop.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              {drop.description}
            </p>
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="mx-auto max-w-7xl border-b border-smoke/70 px-6 py-12 md:px-8">
          <div className="rounded-[1.5rem] border border-smoke/70 bg-gradient-to-br from-paper via-mist/50 to-paper p-8">
            <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-ash">
              Lançamento em
            </p>
            <CountdownTimer
              targetDate={drop.launchDate}
              className="flex justify-center"
            />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Coleção</p>
            <h2 className="mt-2 font-display text-xl tracking-wide">
              Peças da coleção
            </h2>
          </div>
          <p className="text-sm text-ash">Uma seleção de peças apresentadas em contexto e disponibilidade.</p>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-ash">Nenhuma peça nesta coleção ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

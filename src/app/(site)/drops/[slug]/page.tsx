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
      <section className="relative min-h-[50vh] flex items-end">
        <Image
          src={drop.coverImage}
          alt={drop.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16 w-full">
          <p className="text-[10px] tracking-[0.3em] uppercase text-ash">
            {formatDateTime(drop.launchDate)}
          </p>
          <h1 className="font-display text-3xl md:text-5xl tracking-wide mt-2">
            {drop.name}
          </h1>
          <p className="mt-4 text-sm text-ash max-w-xl leading-relaxed">
            {drop.description}
          </p>
        </div>
      </section>

      {upcoming && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 border-b border-smoke">
          <p className="text-[10px] tracking-widest uppercase text-ash mb-6 text-center">
            Lançamento em
          </p>
          <CountdownTimer
            targetDate={drop.launchDate}
            className="flex justify-center"
          />
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <h2 className="font-display text-xl tracking-wide mb-10">
          Peças da coleção
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-ash">Nenhuma peça nesta coleção ainda.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

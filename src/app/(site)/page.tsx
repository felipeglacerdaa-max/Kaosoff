import Link from "next/link";
import {
  getActiveDrop,
  getUpcomingDrop,
  getProducts,
} from "@/lib/api";
import { SITE_CONFIG } from "@/lib/mock-data";
import { DropHero } from "@/components/drop/DropHero";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { CATEGORIES } from "@/lib/mock-data";
import { CATEGORY_LABELS, Category } from "@/lib/types";

export default async function HomePage() {
  const [activeDrop, upcomingDrop, allProducts] = await Promise.all([
    getActiveDrop(),
    getUpcomingDrop(),
    getProducts(),
  ]);

  const latestProducts = allProducts
    .filter((p) => p.status !== "sold")
    .slice(0, 4);

  const saleProducts = allProducts.filter(
    (p) => p.originalPrice && p.status === "available"
  );

  const featuredDrop = upcomingDrop || activeDrop;

  return (
    <>
      {featuredDrop && <DropHero drop={featuredDrop} />}

      {upcomingDrop && activeDrop && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 border-b border-smoke">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-3">
                Coleção em circulação
              </p>
              <h2 className="font-display text-2xl tracking-wide">
                {activeDrop.name}
              </h2>
              <p className="mt-3 text-sm text-ash leading-relaxed">
                {activeDrop.description}
              </p>
              <Link
                href={`/drops/${activeDrop.slug}`}
                className="mt-6 inline-block text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
              >
                Explorar coleção
              </Link>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-3">
                Próximo lançamento
              </p>
              <h3 className="font-display text-xl tracking-wide">
                {upcomingDrop.name}
              </h3>
              <CountdownTimer
                targetDate={upcomingDrop.launchDate}
                className="mt-6 flex justify-end"
              />
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <SectionHeading
          title="Últimos lançamentos"
          subtitle="Peças feitas à mão, uma a uma. Quando vendidas, saem de circulação."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {latestProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
          >
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="bg-mist py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <SectionHeading
              title="Em destaque"
              subtitle="Peças selecionadas com condição especial."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <SectionHeading title="Categorias" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-smoke">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/produtos?categoria=${cat}`}
              className="bg-paper py-10 md:py-14 px-6 flex items-end hover:bg-mist transition-colors duration-300 group"
            >
              <span className="font-display text-lg md:text-xl tracking-wide group-hover:opacity-70 transition-opacity">
                {CATEGORY_LABELS[cat as Category]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 border-t border-smoke">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading title="Sobre a Kaosoff" />
            <p className="text-sm text-ash leading-relaxed">
              {SITE_CONFIG.aboutText}
            </p>
            <Link
              href="/sobre"
              className="mt-8 inline-block text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
            >
              Conheça nossa história
            </Link>
          </div>
          <div className="aspect-[4/3] bg-mist relative">
            <div className="absolute inset-0 flex items-center justify-center text-ash text-sm">
              Foto de bastidores
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

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

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="rounded-[2rem] border border-smoke/80 bg-gradient-to-br from-paper via-mist/60 to-paper p-8 shadow-[0_20px_80px_rgba(20,17,15,0.06)] md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-ash">
                Estética artesanal
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-wide leading-tight">
                Peças que traduzem presença, textura e tempo.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
                A Kaosoff reúne criação manual, materiais cuidadosamente escolhidos e um olhar editorial para cada detalhe.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {[
                { label: "Peças únicas", value: "100%" },
                { label: "Produção artesanal", value: "Feita à mão" },
                { label: "Atendimento", value: "Personalizado" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-smoke/70 bg-paper/90 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-ash">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-lg tracking-wide">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {upcomingDrop && activeDrop && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 border-b border-smoke/70">
          <div className="grid gap-10 rounded-[2rem] border border-smoke/70 bg-paper/80 p-8 shadow-[0_10px_40px_rgba(20,17,15,0.04)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:p-10">
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
                className="mt-6 inline-flex items-center gap-2 text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
              >
                Explorar coleção
                <span aria-hidden>↗</span>
              </Link>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-3">
                Próximo lançamento
              </p>
              <h3 className="font-display text-xl tracking-wide">
                {upcomingDrop.name}
              </h3>
              <CountdownTimer
                targetDate={upcomingDrop.launchDate}
                className="mt-6 flex md:justify-end"
              />
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="mb-12 overflow-hidden rounded-[2rem] border border-smoke/80 bg-gradient-to-br from-paper via-mist/60 to-paper p-8 shadow-[0_20px_80px_rgba(20,17,15,0.06)] md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Featured story</p>
              <h2 className="mt-3 font-display text-2xl leading-tight tracking-wide md:text-3xl">
                Cada peça guarda um contexto, uma matéria e um tempo.
              </h2>
            </div>
            <div className="rounded-[1.5rem] border border-smoke/70 bg-paper/90 p-6 text-sm leading-relaxed text-ash">
              <p>
                A Kaosoff é uma marca feita para quem valoriza presença, acabamento e narrativas visuais discretas. O resultado é uma coleção que se lê tanto pela textura quanto pelo modo como é apresentada.
              </p>
              <Link href="/sobre" className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-ink transition-opacity hover:opacity-70">
                Ler a história
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>

        <SectionHeading
          title="Últimos lançamentos"
          subtitle="Peças feitas à mão, uma a uma. Quando vendidas, saem de circulação."
        />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {latestProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-xs tracking-[0.35em] uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
          >
            Ver todos os produtos
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="bg-mist/70 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <SectionHeading
              title="Em destaque"
              subtitle="Peças selecionadas com condição especial."
            />
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
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
              className="group flex items-end bg-paper py-10 px-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-mist md:py-14"
            >
              <span className="font-display text-lg tracking-wide transition-opacity group-hover:opacity-70 md:text-xl">
                {CATEGORY_LABELS[cat as Category]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 border-t border-smoke/70">
        <div className="grid gap-10 rounded-[2rem] border border-smoke/70 bg-paper/80 p-8 shadow-[0_10px_40px_rgba(20,17,15,0.04)] md:grid-cols-2 md:items-center md:p-10">
          <div>
            <SectionHeading title="Sobre a Kaosoff" />
            <p className="text-sm leading-relaxed text-ash">
              {SITE_CONFIG.aboutText}
            </p>
            <Link
              href="/sobre"
              className="mt-8 inline-flex items-center gap-2 text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
            >
              Conheça nossa história
              <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-smoke/70 bg-mist">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mist to-paper/80 text-sm text-ash">
              Foto de bastidores
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

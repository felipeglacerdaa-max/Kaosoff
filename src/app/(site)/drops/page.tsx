import { Metadata } from "next";
import { getDrops } from "@/lib/api";
import { isDropPast, isDropUpcoming } from "@/lib/utils";
import { DropHero } from "@/components/drop/DropHero";

export const metadata: Metadata = {
  title: "Drops",
  description:
    "Coleções e lançamentos da Kaosoff — peças artesanais em drops exclusivos.",
};

export default async function DropsPage() {
  const drops = await getDrops();
  const upcoming = drops.filter((d) => d.isActive && isDropUpcoming(d));
  const current = drops.filter((d) => d.isActive && isDropPast(d));
  const past = drops.filter((d) => !d.isActive || isDropPast(d));

  return (
    <div className="py-12 md:py-20">
      <section className="mx-auto mb-16 max-w-7xl rounded-[2rem] border border-smoke/80 bg-gradient-to-br from-paper via-mist/60 to-paper px-6 py-10 shadow-[0_20px_80px_rgba(20,17,15,0.06)] md:px-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Coleções</p>
            <h1 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">
              Lançamentos curtos, narrativas longas.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
              Cada drop é uma edição única, criada com continuidade visual, materiais e presença.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-smoke/70 bg-paper/90 p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-ash">Em circulação</p>
            <p className="mt-3 font-display text-2xl tracking-wide">{current.length + upcoming.length} coleções</p>
            <p className="mt-2 text-sm text-ash">Organizadas por temporada e lançamento.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {upcoming.length > 0 && (
          <section className="mb-20">
            <div className="mb-8">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-ash">
                Em breve
              </h3>
            </div>
            {upcoming.map((drop) => (
              <DropHero key={drop.id} drop={drop} />
            ))}
          </section>
        )}

        {current.length > 0 && (
          <section className="mb-20">
            <h3 className="mb-8 text-[10px] uppercase tracking-[0.3em] text-ash">
              Coleções ativas
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              {current.map((drop) => (
                <DropHero key={drop.id} drop={drop} variant="compact" />
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-8 text-[10px] uppercase tracking-[0.3em] text-ash">
            Coleções anteriores
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {past
              .filter((d) => !current.find((c) => c.id === d.id))
              .map((drop) => (
                <DropHero key={drop.id} drop={drop} variant="compact" />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

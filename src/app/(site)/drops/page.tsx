import { Metadata } from "next";
import { getDrops } from "@/lib/api";
import { isDropPast, isDropUpcoming } from "@/lib/utils";
import { DropHero } from "@/components/drop/DropHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
        <SectionHeading
          title="Drops"
          subtitle="Lançamentos por coleção. Cada drop traz peças únicas com data de lançamento."
        />
      </div>

      {upcoming.length > 0 && (
        <section className="mb-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
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
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-ash mb-8">
            Coleções ativas
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {current.map((drop) => (
              <DropHero key={drop.id} drop={drop} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-8">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-ash mb-8">
          Coleções anteriores
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {past
            .filter((d) => !current.find((c) => c.id === d.id))
            .map((drop) => (
              <DropHero key={drop.id} drop={drop} variant="compact" />
            ))}
        </div>
      </section>
    </div>
  );
}

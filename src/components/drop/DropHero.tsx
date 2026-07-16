import Image from "next/image";
import Link from "next/link";
import { Drop } from "@/lib/types";
import { formatDateTime, isDropUpcoming } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

interface DropHeroProps {
  drop: Drop;
  variant?: "full" | "compact";
}

export function DropHero({ drop, variant = "full" }: DropHeroProps) {
  const upcoming = isDropUpcoming(drop);

  if (variant === "compact") {
    return (
      <Link href={`/drops/${drop.slug}`} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden bg-mist">
          <Image
            src={drop.coverImage}
            alt={drop.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-4">
          <p className="text-[10px] tracking-widest uppercase text-ash">
            {formatDateTime(drop.launchDate)}
          </p>
          <h3 className="font-display text-lg tracking-wide mt-1 group-hover:opacity-70 transition-opacity">
            {drop.name}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <section className="grid md:grid-cols-[1fr_0.4fr] gap-0 min-h-[70vh]">
      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-mist">
        <Image
          src={drop.coverImage}
          alt={drop.name}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col justify-center px-8 md:px-12 py-16 bg-paper">
        <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-4">
          {upcoming ? "Próximo drop" : "Coleção atual"}
        </p>
        <h1 className="font-display text-3xl md:text-4xl tracking-wide leading-tight">
          {drop.name}
        </h1>
        <p className="mt-4 text-sm text-ash leading-relaxed">
          {drop.description}
        </p>
        <p className="mt-6 text-xs tracking-widest uppercase">
          {formatDateTime(drop.launchDate)}
        </p>

        {upcoming && (
          <div className="mt-8">
            <CountdownTimer targetDate={drop.launchDate} />
          </div>
        )}

        <Link
          href={`/drops/${drop.slug}`}
          className="mt-10 inline-block text-xs tracking-widest uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity w-fit"
        >
          Ver coleção
        </Link>
      </div>
    </section>
  );
}

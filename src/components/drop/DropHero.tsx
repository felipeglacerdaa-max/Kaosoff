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
    <section className="relative grid min-h-[78vh] gap-0 overflow-hidden border-b border-smoke/70 md:grid-cols-[1.1fr_0.9fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist md:aspect-auto">
        <Image
          src={drop.coverImage}
          alt={drop.name}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
          priority
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_32%)]" />
      </div>

      <div className="flex flex-col justify-center bg-gradient-to-br from-paper via-mist/40 to-paper px-8 py-16 md:px-12">
        <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-ash">
          {upcoming ? "Próximo drop" : "Coleção atual"}
        </p>
        <h1 className="text-display text-3xl leading-[1.05] md:text-4xl">
          {drop.name}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ash">
          {drop.description}
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.35em]">
          {formatDateTime(drop.launchDate)}
        </p>

        {upcoming && (
          <div className="mt-8">
            <CountdownTimer targetDate={drop.launchDate} />
          </div>
        )}

        <Link
          href={`/drops/${drop.slug}`}
          className="mt-10 inline-flex w-fit items-center gap-2 border-b border-ink pb-1 text-xs uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
        >
          Ver coleção
          <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}

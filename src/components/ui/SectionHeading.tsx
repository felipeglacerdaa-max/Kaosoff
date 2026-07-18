import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ash", align === "center" && "justify-center")}> 
        <span className="h-px w-8 bg-smoke" />
        <span>Kaosoff</span>
        <span className="h-px w-8 bg-smoke" />
      </div>
      <h2 className="mt-3 font-display text-2xl tracking-[0.03em] md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">
          {subtitle}
        </p>
      )}
    </div>
  );
}

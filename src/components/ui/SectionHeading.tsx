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
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="font-display text-2xl md:text-3xl tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm text-ash max-w-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

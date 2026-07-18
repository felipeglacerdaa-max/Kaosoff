import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "sold" | "unique" | "sale";
  className?: string;
}

const variants = {
  default: "bg-ink text-paper shadow-[0_8px_24px_rgba(20,17,15,0.16)]",
  sold: "bg-ash text-paper",
  unique: "border border-ink/20 bg-paper/90 text-ink backdrop-blur-sm",
  sale: "bg-charcoal text-paper shadow-[0_8px_24px_rgba(20,17,15,0.16)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-display",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

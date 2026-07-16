import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "sold" | "unique" | "sale";
  className?: string;
}

const variants = {
  default: "bg-ink text-paper",
  sold: "bg-ash text-paper",
  unique: "bg-transparent border border-ink text-ink",
  sale: "bg-ink text-paper",
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

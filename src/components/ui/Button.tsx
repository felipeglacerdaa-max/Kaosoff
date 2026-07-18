import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-charcoal transition-all duration-300 shadow-[0_12px_32px_rgba(20,17,15,0.14)]",
  secondary:
    "bg-mist text-ink hover:bg-smoke transition-all duration-300 border border-ink/10",
  ghost:
    "bg-transparent text-ink hover:bg-mist/80 transition-all duration-300",
  outline:
    "bg-transparent text-ink border border-ink/25 hover:bg-ink hover:text-paper transition-all duration-300",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[10px] tracking-[0.35em] uppercase",
  md: "px-6 py-3 text-xs tracking-[0.35em] uppercase",
  lg: "px-8 py-4 text-sm tracking-[0.35em] uppercase",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display font-normal disabled:opacity-40 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

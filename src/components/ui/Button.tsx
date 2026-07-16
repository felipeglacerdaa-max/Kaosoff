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
    "bg-ink text-paper hover:bg-charcoal transition-colors duration-300",
  secondary:
    "bg-mist text-ink hover:bg-smoke transition-colors duration-300",
  ghost:
    "bg-transparent text-ink hover:bg-mist transition-colors duration-300",
  outline:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper transition-colors duration-300",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-widest uppercase",
  md: "px-6 py-3 text-sm tracking-widest uppercase",
  lg: "px-8 py-4 text-sm tracking-widest uppercase",
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

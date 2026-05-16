import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-white text-black hover:bg-zinc-200": variant === "primary",
            "bg-zinc-800 text-white hover:bg-zinc-700": variant === "secondary",
            "border border-zinc-700 bg-transparent text-white hover:bg-zinc-900 hover:border-zinc-600": variant === "outline",
            "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900": variant === "ghost",
          },
          {
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-14 px-8 text-base": size === "lg",
          },
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

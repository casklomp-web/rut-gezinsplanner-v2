"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90A4] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[#4A90A4] text-white hover:bg-[#3a7a8c]": variant === "default",
            "border-2 border-[#4A90A4] text-[#4A90A4] hover:bg-[#4A90A4]/10": variant === "outline",
            "hover:bg-gray-100": variant === "ghost",
            "h-8 px-3 text-sm": size === "sm",
            "h-11 px-4": size === "md",
            "h-14 px-6 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

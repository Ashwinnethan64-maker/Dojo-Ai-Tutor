import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "yellow"
    | "pink"
    | "mint";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // 2px solid border, tactile hard shadow, spring transition
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-bold rounded-full border-2 border-[#1E293B] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E293B]";

    const variantStyles = {
      primary:
        "bg-[#8B5CF6] text-white shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B] hover:bg-[#7C3AED]",
      secondary:
        "bg-white text-[#1E293B] shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B] hover:bg-[#FBBF24]",
      outline:
        "bg-transparent text-[#1E293B] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] hover:bg-[#F1F5F9] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#1E293B]",
      ghost:
        "border-transparent text-[#1E293B] hover:bg-[#F1F5F9] hover:border-[#1E293B] shadow-none",
      danger:
        "bg-[#EF4444] text-white shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B]",
      yellow:
        "bg-[#FBBF24] text-[#1E293B] shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B] hover:bg-[#F59E0B]",
      pink:
        "bg-[#F472B6] text-[#1E293B] shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B]",
      mint:
        "bg-[#34D399] text-[#1E293B] shadow-[4px_4px_0_#1E293B] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1E293B]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]",
      md: "text-sm px-5 py-2.5 gap-2 min-h-[44px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px]",
      icon: "p-2.5 aspect-square min-h-[44px] min-w-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

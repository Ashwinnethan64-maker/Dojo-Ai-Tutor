import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "purple"
    | "pink"
    | "amber"
    | "mint";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[#1E293B] text-white shadow-[2px_2px_0_#1E293B]",
    secondary:
      "bg-[#F1F5F9] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    outline:
      "bg-white text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    success:
      "bg-[#34D399] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    warning:
      "bg-[#FBBF24] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    danger:
      "bg-[#F43F5E] text-white shadow-[2px_2px_0_#1E293B]",
    purple:
      "bg-[#7C3AED] text-white shadow-[2px_2px_0_#1E293B]",
    pink:
      "bg-[#F472B6] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    amber:
      "bg-[#FBBF24] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
    mint:
      "bg-[#34D399] text-[#1E293B] shadow-[2px_2px_0_#1E293B]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 border-[#1E293B] px-3 py-0.5 font-heading text-xs font-bold uppercase tracking-wider select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

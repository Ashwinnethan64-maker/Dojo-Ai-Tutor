import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  indicatorClassName?: string;
  variant?: "primary" | "secondary" | "success" | "accent" | "pink" | "yellow";
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  variant = "primary",
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    primary: "bg-[#8B5CF6]",
    secondary: "bg-[#64748B]",
    success: "bg-[#34D399]",
    accent: "bg-[#FBBF24]",
    pink: "bg-[#F472B6]",
    yellow: "bg-[#FBBF24]",
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full border-2 border-[#1E293B] bg-[#FFFDF5] p-0.5 shadow-[2px_2px_0_#1E293B]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full border-r border-[#1E293B] transition-all duration-500 ease-out",
          variantStyles[variant],
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

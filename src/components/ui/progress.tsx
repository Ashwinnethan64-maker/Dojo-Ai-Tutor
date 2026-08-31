import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  indicatorClassName?: string;
  variant?: "primary" | "accent" | "success" | "danger";
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  variant = "primary",
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const variantColors = {
    primary: "bg-indigo-600 dark:bg-indigo-500",
    accent: "bg-amber-500 dark:bg-amber-400",
    success: "bg-emerald-500",
    danger: "bg-red-500",
  };

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-in-out rounded-full",
          variantColors[variant],
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}

import React from "react";
import { BeltTier } from "@/types";
import { cn } from "@/lib/utils";

export interface BeltBadgeProps {
  belt: BeltTier;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const BELT_CONFIG: Record<
  BeltTier,
  {
    name: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    barColor: string;
    accentGlow: string;
  }
> = {
  white: {
    name: "White Belt",
    bgClass: "bg-zinc-100 dark:bg-zinc-800",
    textClass: "text-zinc-700 dark:text-zinc-200",
    borderClass: "border-zinc-300 dark:border-zinc-700",
    barColor: "#e4e4e7",
    accentGlow: "rgba(228, 228, 231, 0.2)",
  },
  yellow: {
    name: "Yellow Belt",
    bgClass: "bg-yellow-500/15 dark:bg-yellow-400/15",
    textClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-400/30",
    barColor: "#eab308",
    accentGlow: "rgba(234, 179, 8, 0.25)",
  },
  orange: {
    name: "Orange Belt",
    bgClass: "bg-amber-500/15 dark:bg-amber-400/15",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/30",
    barColor: "#f97316",
    accentGlow: "rgba(249, 115, 22, 0.25)",
  },
  green: {
    name: "Green Belt",
    bgClass: "bg-emerald-500/15 dark:bg-emerald-400/15",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30",
    barColor: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.25)",
  },
  blue: {
    name: "Blue Belt",
    bgClass: "bg-blue-500/15 dark:bg-blue-400/15",
    textClass: "text-blue-600 dark:text-blue-400",
    borderClass: "border-blue-500/30",
    barColor: "#3b82f6",
    accentGlow: "rgba(59, 130, 246, 0.25)",
  },
  purple: {
    name: "Purple Belt",
    bgClass: "bg-indigo-500/15 dark:bg-indigo-400/15",
    textClass: "text-indigo-600 dark:text-indigo-400",
    borderClass: "border-indigo-500/30",
    barColor: "#8b5cf6",
    accentGlow: "rgba(139, 92, 246, 0.25)",
  },
  brown: {
    name: "Brown Belt",
    bgClass: "bg-amber-800/20 dark:bg-amber-900/40",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-800/40",
    barColor: "#78350f",
    accentGlow: "rgba(120, 53, 15, 0.25)",
  },
  black: {
    name: "Black Belt",
    bgClass: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950",
    textClass: "text-zinc-900 dark:text-zinc-50 font-bold",
    borderClass: "border-zinc-800 dark:border-zinc-300",
    barColor: "#18181b",
    accentGlow: "rgba(0, 0, 0, 0.4)",
  },
};

export function BeltBadge({
  belt,
  size = "md",
  showIcon = true,
  className,
}: BeltBadgeProps) {
  const config = BELT_CONFIG[belt] || BELT_CONFIG.white;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-medium uppercase tracking-wider select-none",
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && (
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: config.barColor }}
        />
      )}
      <span>{config.name}</span>
    </div>
  );
}

export function BeltCard({
  belt,
  progress = 0,
  isActive = false,
  language = "Python",
  onClick,
}: {
  belt: BeltTier;
  progress?: number;
  isActive?: boolean;
  language?: string;
  onClick?: () => void;
}) {
  const config = BELT_CONFIG[belt] || BELT_CONFIG.white;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
        "bg-white dark:bg-[#121215]",
        isActive
          ? "border-indigo-500/60 shadow-md ring-1 ring-indigo-500/20"
          : "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Martial Arts Belt Strip Indicator */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5"
        style={{ backgroundColor: config.barColor }}
      />

      <div className="pl-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            {language}
          </span>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {config.name}
          </h4>
        </div>
        <BeltBadge belt={belt} size="sm" />
      </div>

      <div className="pl-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
        <span>Mastery</span>
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
          {progress}%
        </span>
      </div>
    </div>
  );
}

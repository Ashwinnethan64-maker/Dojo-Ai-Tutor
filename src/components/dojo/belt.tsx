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
    pillShadow: string;
  }
> = {
  white: {
    name: "White Belt",
    bgClass: "bg-white",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#E2E8F0",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  yellow: {
    name: "Yellow Belt",
    bgClass: "bg-[#FBBF24]",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#F59E0B",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  orange: {
    name: "Orange Belt",
    bgClass: "bg-[#FB923C]",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#EA580C",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  green: {
    name: "Green Belt",
    bgClass: "bg-[#34D399]",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#059669",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  blue: {
    name: "Blue Belt",
    bgClass: "bg-[#60A5FA]",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#2563EB",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  purple: {
    name: "Purple Belt",
    bgClass: "bg-[#A78BFA]",
    textClass: "text-[#1E293B]",
    borderClass: "border-[#1E293B]",
    barColor: "#7C3AED",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  brown: {
    name: "Brown Belt",
    bgClass: "bg-[#B45309]",
    textClass: "text-white",
    borderClass: "border-[#1E293B]",
    barColor: "#78350F",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
  },
  black: {
    name: "Black Belt",
    bgClass: "bg-[#1E293B]",
    textClass: "text-white",
    borderClass: "border-[#1E293B]",
    barColor: "#000000",
    pillShadow: "shadow-[2px_2px_0_#1E293B]",
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
    sm: "px-2.5 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2 font-bold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 font-heading font-bold uppercase tracking-wider select-none",
        config.bgClass,
        config.textClass,
        config.borderClass,
        config.pillShadow,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && (
        <span
          className="inline-block w-2.5 h-2.5 rounded-full border border-[#1E293B]"
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
        "relative flex flex-col p-5 rounded-2xl border-2 border-[#1E293B] transition-all duration-200 cursor-pointer overflow-hidden bg-white",
        isActive
          ? "shadow-[6px_6px_0_#8B5CF6] -translate-y-0.5 bg-[#FFFDF5]"
          : "shadow-[6px_6px_0_#1E293B] hover:-translate-y-1 hover:shadow-[8px_8px_0_#1E293B]"
      )}
    >
      {/* Martial Arts Belt Indicator Strip */}
      <div
        className="absolute top-0 left-0 bottom-0 w-2.5 border-r-2 border-[#1E293B]"
        style={{ backgroundColor: config.barColor }}
      />

      <div className="pl-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#64748B]">
            {language}
          </span>
          <h4 className="font-heading text-base font-bold text-[#1E293B]">
            {config.name}
          </h4>
        </div>
        <BeltBadge belt={belt} size="sm" />
      </div>

      <div className="pl-3 mt-4 pt-3 border-t-2 border-[#1E293B]/10 flex items-center justify-between text-xs font-semibold text-[#64748B]">
        <span>Mastery Level</span>
        <span className="font-heading font-bold text-sm text-[#1E293B]">
          {progress}%
        </span>
      </div>
    </div>
  );
}

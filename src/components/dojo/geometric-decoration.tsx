import React from "react";
import { cn } from "@/lib/utils";

interface GeometricDecorationProps {
  variant?: "dot-grid" | "star" | "squiggle" | "blob" | "badge" | "stripes";
  color?: "violet" | "pink" | "yellow" | "mint" | "slate";
  size?: "sm" | "md" | "lg";
  className?: string;
  rotation?: number;
}

export function GeometricDecoration({
  variant = "star",
  color = "yellow",
  size = "md",
  className,
  rotation = 0,
}: GeometricDecorationProps) {
  const colorMap = {
    violet: "#8B5CF6",
    pink: "#F472B6",
    yellow: "#FBBF24",
    mint: "#34D399",
    slate: "#1E293B",
  };

  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const fillColor = colorMap[color];

  return (
    <div
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={cn("pointer-events-none select-none inline-block", sizeMap[size], className)}
    >
      {variant === "star" && (
        <svg viewBox="0 0 24 24" fill={fillColor} stroke="#1E293B" strokeWidth="2" className="w-full h-full drop-shadow-[2px_2px_0_#1E293B]">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      )}

      {variant === "squiggle" && (
        <svg viewBox="0 0 40 16" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" className="w-full h-full">
          <path d="M2 8c4-6 8-6 12 0s8 6 12 0 8-6 12 0" />
        </svg>
      )}

      {variant === "blob" && (
        <svg viewBox="0 0 24 24" fill={fillColor} stroke="#1E293B" strokeWidth="2" className="w-full h-full drop-shadow-[2px_2px_0_#1E293B]">
          <path d="M12 3c4.5 0 9 2.5 9 7s-4 11-9 11S3 14.5 3 10s4.5-7 9-7z" />
        </svg>
      )}

      {variant === "badge" && (
        <div
          className="w-full h-full rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
          style={{ backgroundColor: fillColor }}
        />
      )}
    </div>
  );
}

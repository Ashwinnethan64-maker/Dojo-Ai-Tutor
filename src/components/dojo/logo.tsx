import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DojoLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: { img: 24, box: "h-7 w-7 rounded-lg", text: "text-base", badge: "text-[10px]" },
  md: { img: 32, box: "h-9 w-9 rounded-xl", text: "text-lg", badge: "text-xs" },
  lg: { img: 40, box: "h-11 w-11 rounded-2xl", text: "text-2xl", badge: "text-xs" },
  xl: { img: 56, box: "h-16 w-16 rounded-3xl", text: "text-3xl", badge: "text-sm" },
};

export function DojoLogo({
  size = "md",
  showText = true,
  className,
  priority = false,
}: DojoLogoProps) {
  const config = SIZE_MAP[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Brand Icon Box */}
      <div
        className={cn(
          "bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[3px_3px_0_#1E293B] shrink-0 overflow-hidden relative group-hover:rotate-6 transition-transform duration-150",
          config.box
        )}
      >
        <Image
          src="/Dojo_ai.ico"
          alt="DOJO AI"
          width={config.img}
          height={config.img}
          priority={priority}
          className="object-contain"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-heading font-black tracking-tight text-[#1E293B] leading-none",
              config.text
            )}
          >
            DOJO
          </span>
          <span
            className={cn(
              "text-[#8B5CF6] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#FFFDF5] border border-[#1E293B] shadow-[1px_1px_0_#1E293B] leading-none",
              config.badge
            )}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}

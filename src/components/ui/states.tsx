import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-[#1E293B] bg-white shadow-[6px_6px_0_#1E293B] overflow-hidden",
        className
      )}
    >
      {/* Playful Geometric corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#F472B6] border border-[#1E293B]" />
      <div className="absolute top-2 right-2 w-3 h-3 bg-[#FBBF24] border border-[#1E293B] rotate-45" />
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#34D399] border border-[#1E293B]" />
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#8B5CF6] border border-[#1E293B]" />

      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] shadow-[4px_4px_0_#1E293B] mb-4">
          <Icon className="h-7 w-7 stroke-[2.5]" />
        </div>
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#1E293B] bg-[#8B5CF6] text-white shadow-[4px_4px_0_#1E293B] mb-4">
          <Sparkles className="h-7 w-7 stroke-[2.5]" />
        </div>
      )}

      <h3 className="font-heading text-lg font-bold text-[#1E293B]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#64748B] max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="primary" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-2">
      <div
        className={cn(
          "rounded-full border-[#1E293B] border-t-[#8B5CF6] animate-spin shadow-[2px_2px_0_#1E293B]",
          sizes[size],
          className
        )}
      />
      <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#64748B]">
        Sensei is preparing...
      </span>
    </div>
  );
}

export function ErrorState({
  title = "Something went sideways",
  description = "An error occurred while loading this section. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[6px_6px_0_#EF4444] text-center space-y-2">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-[#EF4444] text-white shadow-[2px_2px_0_#1E293B] mb-1">
        ⚠️
      </div>
      <h4 className="font-heading text-base font-bold text-[#1E293B]">
        {title}
      </h4>
      <p className="text-xs text-[#64748B] max-w-sm mx-auto">
        {description}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-3"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

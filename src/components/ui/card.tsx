import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  shadowVariant?: "hard" | "featured" | "yellow" | "mint" | "subtle" | "none";
}

export function Card({
  className,
  hoverable = false,
  shadowVariant = "hard",
  ...props
}: CardProps) {
  const shadowClasses = {
    hard: "shadow-[6px_6px_0_#1E293B]",
    featured: "shadow-[8px_8px_0_#F472B6]",
    yellow: "shadow-[8px_8px_0_#FBBF24]",
    mint: "shadow-[8px_8px_0_#34D399]",
    subtle: "shadow-[6px_6px_0_#E2E8F0]",
    none: "shadow-none",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[#1E293B] bg-white text-[#1E293B] transition-all duration-200",
        shadowClasses[shadowVariant],
        hoverable &&
          "hover:-translate-y-1 hover:shadow-[8px_8px_0_#1E293B] hover:rotate-[-0.5deg]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-heading text-lg font-bold leading-tight tracking-tight text-[#1E293B]",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-[#64748B] leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0 border-t-2 border-[#1E293B]/10 mt-4",
        className
      )}
      {...props}
    />
  );
}

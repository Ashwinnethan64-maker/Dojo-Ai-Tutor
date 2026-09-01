import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 font-sans text-sm font-medium rounded-xl border-2 border-[#1E293B] bg-white text-[#1E293B] placeholder-[#94A3B8] transition-all duration-150",
            "focus:outline-none focus:border-[#8B5CF6] focus:shadow-[4px_4px_0_#8B5CF6] focus:-translate-y-0.5",
            "disabled:opacity-50 disabled:bg-[#F1F5F9] disabled:cursor-not-allowed",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:shadow-[4px_4px_0_#EF4444]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-[#EF4444]">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

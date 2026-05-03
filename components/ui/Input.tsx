"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-sm border px-3 text-body-md text-ink bg-canvas",
            "placeholder:text-muted transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            error
              ? "border-error focus:ring-error"
              : "border-hairline hover:border-outline",
            className
          )}
          {...props}
        />
        {error && <p className="text-caption text-error">{error}</p>}
        {!error && helpText && <p className="text-caption text-muted">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[120px] rounded-sm border px-3 py-2.5",
            "text-body-md text-ink bg-canvas resize-vertical",
            "placeholder:text-muted transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            error
              ? "border-error focus:ring-error"
              : "border-hairline hover:border-outline",
            className
          )}
          {...props}
        />
        {error && <p className="text-caption text-error">{error}</p>}
        {!error && helpText && <p className="text-caption text-muted">{helpText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

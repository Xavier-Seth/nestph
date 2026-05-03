"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-active " +
    "disabled:bg-primary-disabled disabled:cursor-not-allowed",
  secondary:
    "bg-secondary-container text-primary hover:bg-secondary-container/80 " +
    "active:bg-secondary-container/60 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-primary hover:bg-surface-soft active:bg-surface-container " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-error text-white hover:bg-error/90 active:bg-error/80 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      fullWidth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center font-medium rounded-sm",
      "transition-colors duration-150 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

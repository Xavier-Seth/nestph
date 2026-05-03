import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  elevated,
  padding = "none",
  className,
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "bg-surface-card rounded-md border border-hairline overflow-hidden",
        elevated && "shadow-card",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

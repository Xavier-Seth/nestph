import { cn } from "@/lib/utils";
import type { PropertyStatus, AgentStatus } from "@/types";

type BadgeVariant = PropertyStatus | AgentStatus | "featured";

const variantClasses: Record<BadgeVariant, string> = {
  for_sale: "bg-primary text-white",
  sold:     "bg-muted text-white",
  pending:  "bg-amber-600 text-white",
  approved: "bg-emerald-600 text-white",
  suspended:"bg-error text-white",
  featured: "bg-amber-500 text-white",
};

const labels: Record<BadgeVariant, string> = {
  for_sale: "For Sale",
  sold:     "Sold",
  pending:  "Pending",
  approved: "Approved",
  suspended:"Suspended",
  featured: "Featured",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium",
        variantClasses[variant],
        className
      )}
    >
      {label ?? labels[variant]}
    </span>
  );
}

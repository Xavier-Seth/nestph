export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceCompact(price: number): string {
  if (price >= 1_000_000) {
    return `₱${(price / 1_000_000).toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `₱${(price / 1_000).toFixed(0)}K`;
  }
  return formatPrice(price);
}

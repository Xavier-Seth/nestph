"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PriceRangeSlider } from "@/components/ui/PriceRangeSlider";

const MIN_PRICE = 0;
const MAX_PRICE = 50_000_000;

interface FilterPanelProps {
  initialFilters: {
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    bathrooms?: number;
    sort?: string;
    view?: string;
  };
}

export function FilterPanel({ initialFilters }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.min_price ?? MIN_PRICE,
    initialFilters.max_price ?? MAX_PRICE,
  ]);

  function buildParams(overrides: Record<string, string | null>) {
    const current = {
      city: initialFilters.city || null,
      property_type: initialFilters.property_type || null,
      min_price:
        initialFilters.min_price && initialFilters.min_price > MIN_PRICE
          ? String(initialFilters.min_price)
          : null,
      max_price:
        initialFilters.max_price && initialFilters.max_price < MAX_PRICE
          ? String(initialFilters.max_price)
          : null,
      bedrooms: initialFilters.bedrooms ? String(initialFilters.bedrooms) : null,
      bathrooms: initialFilters.bathrooms ? String(initialFilters.bathrooms) : null,
      sort: initialFilters.sort || null,
      view: initialFilters.view || null,
    };

    const merged = { ...current, ...overrides };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return params.toString();
  }

  function navigate(overrides: Record<string, string | null>) {
    const qs = buildParams(overrides);
    startTransition(() => {
      router.push(`${pathname}?${qs}`);
    });
  }

  function applyPrice() {
    navigate({
      min_price: priceRange[0] > MIN_PRICE ? String(priceRange[0]) : null,
      max_price: priceRange[1] < MAX_PRICE ? String(priceRange[1]) : null,
    });
  }

  return (
    <div className="bg-canvas border-b border-hairline sticky top-16 z-40">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-wrap items-end gap-x-4 gap-y-3">
          {/* Price Range slider + Apply */}
          <div className="flex items-end gap-2">
            <div className="w-52">
              <PriceRangeSlider
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={priceRange}
                onChange={setPriceRange}
                step={500_000}
                label="Price Range"
              />
            </div>
            <button
              onClick={applyPrice}
              disabled={isPending}
              className="h-9 px-3 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors duration-150 shrink-0"
            >
              Apply
            </button>
          </div>

          {/* Property Type */}
          <select
            value={initialFilters.property_type || ""}
            onChange={(e) =>
              navigate({ property_type: e.target.value || null })
            }
            disabled={isPending}
            className="h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
            aria-label="Property type"
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>

          {/* Beds */}
          <select
            value={initialFilters.bedrooms ? String(initialFilters.bedrooms) : ""}
            onChange={(e) => navigate({ bedrooms: e.target.value || null })}
            disabled={isPending}
            className="h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
            aria-label="Bedrooms"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>

          {/* Baths */}
          <select
            value={initialFilters.bathrooms ? String(initialFilters.bathrooms) : ""}
            onChange={(e) => navigate({ bathrooms: e.target.value || null })}
            disabled={isPending}
            className="h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
            aria-label="Bathrooms"
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
          </select>

          {/* Sort — right-aligned */}
          <div className="ml-auto">
            <select
              value={initialFilters.sort || "newest"}
              onChange={(e) => navigate({ sort: e.target.value })}
              disabled={isPending}
              className="h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
              aria-label="Sort by"
            >
              <option value="newest">Newest</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

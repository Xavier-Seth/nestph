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
    area_min?: number;
    area_max?: number;
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

  const [areaMin, setAreaMin] = useState(
    initialFilters.area_min != null ? String(initialFilters.area_min) : ""
  );
  const [areaMax, setAreaMax] = useState(
    initialFilters.area_max != null ? String(initialFilters.area_max) : ""
  );

  // Count non-default active filters (city excluded — driven by SearchBar)
  const activeCount = [
    !!initialFilters.property_type,
    (initialFilters.min_price ?? 0) > MIN_PRICE,
    (initialFilters.max_price ?? MAX_PRICE) < MAX_PRICE,
    !!initialFilters.bedrooms,
    !!initialFilters.bathrooms,
    initialFilters.area_min != null,
    initialFilters.area_max != null,
    !!initialFilters.sort && initialFilters.sort !== "newest",
  ].filter(Boolean).length;

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
      area_min: initialFilters.area_min != null ? String(initialFilters.area_min) : null,
      area_max: initialFilters.area_max != null ? String(initialFilters.area_max) : null,
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

  function applyArea() {
    const minVal = areaMin.trim() ? areaMin.trim() : null;
    const maxVal = areaMax.trim() ? areaMax.trim() : null;
    navigate({ area_min: minVal, area_max: maxVal });
  }

  function clearAll() {
    setAreaMin("");
    setAreaMax("");
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    navigate({
      property_type: null,
      min_price: null,
      max_price: null,
      bedrooms: null,
      bathrooms: null,
      area_min: null,
      area_max: null,
      sort: null,
    });
  }

  const inputCls =
    "h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

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
            onChange={(e) => navigate({ property_type: e.target.value || null })}
            disabled={isPending}
            className={`${inputCls} cursor-pointer`}
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
            className={`${inputCls} cursor-pointer`}
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
            className={`${inputCls} cursor-pointer`}
            aria-label="Bathrooms"
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
          </select>

          {/* Floor Area */}
          <div className="flex items-end gap-1.5">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-muted font-medium">Floor Area (sqm)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyArea()}
                  disabled={isPending}
                  placeholder="Any"
                  aria-label="Minimum floor area in sqm"
                  className={`${inputCls} w-20`}
                />
                <span className="text-caption text-muted">–</span>
                <input
                  type="number"
                  min={0}
                  value={areaMax}
                  onChange={(e) => setAreaMax(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyArea()}
                  disabled={isPending}
                  placeholder="Any"
                  aria-label="Maximum floor area in sqm"
                  className={`${inputCls} w-20`}
                />
              </div>
            </div>
            <button
              onClick={applyArea}
              disabled={isPending}
              className="h-9 px-3 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors duration-150 shrink-0"
            >
              Apply
            </button>
          </div>

          {/* Clear all — only when filters active */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              disabled={isPending}
              className="h-9 px-3 rounded-sm border border-hairline text-body-sm text-muted hover:text-ink hover:bg-surface-soft disabled:opacity-50 transition-colors duration-150 shrink-0 whitespace-nowrap"
            >
              Filters ({activeCount}) ✕
            </button>
          )}

          {/* Sort — right-aligned */}
          <div className="ml-auto">
            <select
              value={initialFilters.sort || "newest"}
              onChange={(e) => navigate({ sort: e.target.value })}
              disabled={isPending}
              className={`${inputCls} cursor-pointer`}
              aria-label="Sort by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="area_desc">Largest Area</option>
              <option value="area_asc">Smallest Area</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

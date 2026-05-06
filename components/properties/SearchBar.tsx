"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PropertyType } from "@/types";

const PROPERTY_TYPES: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

interface SearchBarProps {
  initialCity?: string;
  initialType?: string;
  variant?: "hero" | "page";
}

export function SearchBar({
  initialCity = "",
  initialType = "",
  variant = "page",
}: SearchBarProps) {
  const [city, setCity] = useState(initialCity);
  const [propertyType, setPropertyType] = useState(initialType);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (propertyType) params.set("property_type", propertyType);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  }

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full overflow-hidden shadow-elevated max-w-2xl mx-auto"
      >
        <input
          type="text"
          placeholder="Location (Cebu City, Mandaue…)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 h-14 px-6 text-body-md text-ink bg-transparent border-none outline-none placeholder:text-muted min-w-0"
          aria-label="City or location"
        />
        <div className="w-px h-7 bg-hairline shrink-0" aria-hidden="true" />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="h-14 px-4 text-body-md text-ink bg-transparent border-none outline-none cursor-pointer shrink-0"
          aria-label="Property type"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="m-2 h-10 px-6 rounded-full bg-primary text-white text-body-md font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150 shrink-0"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search location…"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="h-10 flex-1 min-w-0 rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-label="City or location"
      />
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="h-10 rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
        aria-label="Property type"
      >
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-10 px-4 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150 shrink-0"
      >
        Search
      </button>
    </form>
  );
}

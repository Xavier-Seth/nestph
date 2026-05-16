"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Property } from "@/types";

const STORAGE_KEY = "nestph_recently_viewed";
const MAX_STORED = 8;
const MAX_DISPLAYED = 4;

interface RecentlyViewedProps {
  propertyId: string;
}

export function RecentlyViewed({ propertyId }: RecentlyViewedProps) {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Read + update localStorage
    let ids: string[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      ids = raw ? (JSON.parse(raw) as string[]) : [];
      if (!Array.isArray(ids)) ids = [];
    } catch {
      ids = [];
    }

    // Validate each element is a UUID string before use
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    ids = ids.filter((id) => typeof id === "string" && UUID_RE.test(id));

    // Deduplicate then prepend current
    ids = ids.filter((id) => id !== propertyId);
    ids.unshift(propertyId);
    ids = ids.slice(0, MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

    // IDs to display — exclude current property
    const displayIds = ids.filter((id) => id !== propertyId).slice(0, MAX_DISPLAYED);
    if (displayIds.length < 1) return;

    // Fetch from Supabase (browser client, respects RLS)
    const supabase = createClient();
    supabase
      .from("properties")
      .select("id, agent_id, title, description, price, property_type, status, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, images, amenities, featured, created_at, updated_at")
      .in("id", displayIds)
      .eq("status", "for_sale")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        // Preserve localStorage order
        const ordered = displayIds
          .map((id) => data.find((p) => p.id === id))
          .filter(Boolean) as Property[];
        setProperties(ordered);
      });
  }, [propertyId]);

  // Need at least 2 stored properties (excluding current) to render
  if (properties.length < 2) return null;

  return (
    <section className="mt-12">
      <h2 className="text-h3 font-semibold text-ink mb-4">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {properties.map((property) => (
          <div key={property.id} className="w-64 shrink-0">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}

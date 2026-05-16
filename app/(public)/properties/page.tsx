import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FilterPanel } from "@/components/properties/FilterPanel";
import { PropertiesView } from "@/components/properties/PropertiesView";
import { SearchBar } from "@/components/properties/SearchBar";
import type { Property, PropertyType } from "@/types";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse all property listings in Cebu City, Mandaue, Lapu-Lapu, and Talisay.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  const n = s ? parseInt(s, 10) : NaN;
  return isNaN(n) ? undefined : n;
}

function float(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  const n = s ? parseFloat(s) : NaN;
  return isNaN(n) ? undefined : n;
}

const SQM_TO_SQFT = 10.764;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const city = str(params.city);
  const propertyType = str(params.property_type) as PropertyType | undefined;
  const minPrice = num(params.min_price);
  const maxPrice = num(params.max_price);
  const bedrooms = num(params.bedrooms);
  const bathrooms = num(params.bathrooms);
  const featured = str(params.featured);
  const sort = str(params.sort) ?? "newest";
  // area_min / area_max are stored in sqm in URL; convert to sqft for DB query
  const areaMinSqm = float(params.area_min);
  const areaMaxSqm = float(params.area_max);
  const areaMinSqft = areaMinSqm != null ? Math.floor(areaMinSqm * SQM_TO_SQFT) : undefined;
  const areaMaxSqft = areaMaxSqm != null ? Math.ceil(areaMaxSqm * SQM_TO_SQFT) : undefined;

  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select(
      "id, agent_id, title, description, price, property_type, status, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, images, amenities, featured, created_at, updated_at"
    );

  if (city) query = query.ilike("city", `%${city}%`);
  if (propertyType) query = query.eq("property_type", propertyType);
  if (minPrice != null) query = query.gte("price", minPrice);
  if (maxPrice != null) query = query.lte("price", maxPrice);
  if (bedrooms != null) query = query.gte("bedrooms", bedrooms);
  if (bathrooms != null) query = query.gte("bathrooms", bathrooms);
  if (featured === "true") query = query.eq("featured", true);
  if (areaMinSqft != null) query = query.gte("area_sqft", areaMinSqft);
  if (areaMaxSqft != null) query = query.lte("area_sqft", areaMaxSqft);

  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "price_high") {
    query = query.order("price", { ascending: false });
  } else if (sort === "price_low") {
    query = query.order("price", { ascending: true });
  } else if (sort === "area_desc") {
    query = query.order("area_sqft", { ascending: false, nullsFirst: false });
  } else if (sort === "area_asc") {
    query = query.order("area_sqft", { ascending: true, nullsFirst: false });
  } else {
    // default: newest
    query = query.order("created_at", { ascending: false });
  }

  const { data: properties } = await query.returns<Property[]>();
  const listings = properties ?? [];

  const initialFilters = {
    city,
    property_type: propertyType,
    min_price: minPrice,
    max_price: maxPrice,
    bedrooms,
    bathrooms,
    area_min: areaMinSqm,
    area_max: areaMaxSqm,
    sort,
  };

  return (
    <>
      {/* Filter bar */}
      <FilterPanel initialFilters={initialFilters} />

      {/* Search bar */}
      <div className="bg-surface border-b border-hairline">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-3">
          <SearchBar
            initialCity={city ?? ""}
            initialType={propertyType ?? ""}
            variant="page"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-8">
        <PropertiesView
          properties={listings}
          count={listings.length}
          query={city}
        />
      </div>
    </>
  );
}

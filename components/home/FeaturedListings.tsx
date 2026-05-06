import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Property } from "@/types";

export async function FeaturedListings() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*, agent:agents(id, name, email, phone, bio, avatar_url, years_experience, fb_username, status, role, created_at, updated_at)")
    .eq("featured", true)
    .eq("status", "for_sale")
    .limit(3)
    .returns<Property[]>();

  const listings = properties ?? [];

  return (
    <section className="py-16 bg-canvas">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-h2 font-semibold text-ink">Featured Properties</h2>
            <p className="text-body-md text-muted mt-2">
              Handpicked premium listings recently added to the market
            </p>
          </div>
          <Link
            href="/properties?featured=true"
            className="text-body-sm font-medium text-primary hover:text-primary-dark transition-colors shrink-0"
          >
            View all listings →
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-hairline rounded-md bg-surface">
            <p className="text-body-md text-muted">No featured listings yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

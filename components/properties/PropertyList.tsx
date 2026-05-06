import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyListProps {
  properties: Property[];
}

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-body-lg text-muted">No properties found.</p>
        <p className="text-body-sm text-muted mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {properties.map((property) => (
        <Link key={property.id} href={`/properties/${property.id}`} className="group block">
          <article className="bg-surface-card rounded-md border border-hairline overflow-hidden transition-shadow duration-200 hover:shadow-card">
            <div className="flex">
              <div className="relative w-44 sm:w-60 shrink-0 bg-surface-soft">
                {property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 176px, 240px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-hairline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[1.25rem] font-semibold text-ink leading-tight">
                        {formatPrice(property.price)}
                      </p>
                      <p className="text-body-sm text-muted mt-0.5 truncate">
                        {property.address}, {property.city}
                      </p>
                    </div>
                    <Badge variant={property.status} className="shrink-0 mt-0.5" />
                  </div>
                  <p className="text-body-md font-medium text-ink mt-2 truncate">
                    {property.title}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-label-bold text-muted flex-wrap">
                  {property.bedrooms != null && (
                    <span>{property.bedrooms} BD</span>
                  )}
                  {property.bedrooms != null && property.bathrooms != null && (
                    <span className="text-hairline select-none">·</span>
                  )}
                  {property.bathrooms != null && (
                    <span>{property.bathrooms} BA</span>
                  )}
                  {property.area_sqft != null &&
                    (property.bedrooms != null || property.bathrooms != null) && (
                      <span className="text-hairline select-none">·</span>
                    )}
                  {property.area_sqft != null && (
                    <span>{property.area_sqft.toLocaleString()} sqft</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

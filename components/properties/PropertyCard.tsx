import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images[0];

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <article className="bg-surface-card rounded-md border border-hairline overflow-hidden transition-shadow duration-200 hover:shadow-card h-full">
        <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-hairline"
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
          <div className="absolute top-3 left-3">
            <Badge variant={property.status} />
          </div>
        </div>

        <div className="p-4">
          <p className="text-[1.25rem] font-semibold text-ink leading-tight">
            {formatPrice(property.price)}
          </p>
          <p className="text-body-sm text-muted mt-1 truncate">
            {property.address}, {property.city}
          </p>
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
      </article>
    </Link>
  );
}

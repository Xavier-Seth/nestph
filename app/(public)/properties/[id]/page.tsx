import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { PhotoGallery } from "@/components/properties/PhotoGallery";
import { MortgageCalculator } from "@/components/properties/MortgageCalculator";
import { AgentCard } from "@/components/agents/AgentCard";
import { formatPrice } from "@/lib/utils";
import { ShareBar } from "@/components/properties/ShareBar";
import { RecentlyViewed } from "@/components/properties/RecentlyViewed";
import { SimilarListings } from "@/components/properties/SimilarListings";
import type { Property } from "@/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("title, description, city, images")
    .eq("id", id)
    .single();
  if (!data) return { title: "Property Not Found" };

  const title = `${data.title} — ${data.city} | NestPH`;
  const description = (data.description ?? "").slice(0, 160);
  const url = `https://nestph.com/properties/${id}`;
  const firstImage = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(firstImage ? { images: [{ url: firstImage }] } : {}),
    },
    twitter: {
      card: firstImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(firstImage ? { images: [firstImage] } : {}),
    },
  };
}

const AMENITY_ICONS: Record<string, string> = {
  pool: "🏊",
  gym: "🏋️",
  parking: "🅿️",
  garden: "🌿",
  security: "🔒",
  elevator: "🛗",
  balcony: "🏙️",
  wifi: "📶",
  aircon: "❄️",
  "function hall": "🏛️",
};

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "✓";
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select(
      "*, agent:agents(id, name, email, phone, bio, avatar_url, years_experience, fb_username, status, role, created_at, updated_at)"
    )
    .eq("id", id)
    .single<Property>();

  if (!property) notFound();

  const agent = property.agent;

  const propertyTypeLabel: Record<string, string> = {
    house: "House",
    condo: "Condo",
    apartment: "Apartment",
    land: "Land",
    commercial: "Commercial",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://nestph.com/properties/${property.id}`,
    price: property.price,
    priceCurrency: "PHP",
    numberOfRooms: property.bedrooms,
    ...(property.area_sqft != null
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.area_sqft,
            unitCode: "FTK",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressCountry: "PH",
    },
    image: property.images,
  };

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-body-sm text-muted mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/properties" className="hover:text-ink transition-colors">
          Properties
        </Link>
        <span aria-hidden="true">›</span>
        <Link
          href={`/properties?city=${encodeURIComponent(property.city)}`}
          className="hover:text-ink transition-colors"
        >
          {property.city}
        </Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink truncate max-w-[240px]">{property.title}</span>
      </nav>

      {/* Photo Gallery */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* 2-col layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: Details */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-start gap-3 flex-wrap">
            <Badge variant={property.status} />
            {property.featured && <Badge variant="featured" />}
            <span className="text-body-sm text-muted">{propertyTypeLabel[property.property_type] ?? property.property_type}</span>
          </div>
          <h1 className="text-h1 font-semibold text-ink mt-3 leading-tight">
            {property.title}
          </h1>
          <p className="text-body-md text-muted mt-1">
            {property.address}, {property.city}, {property.state}
            {property.zip_code ? ` ${property.zip_code}` : ""}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-h1 font-semibold text-primary">
              {formatPrice(property.price)}
            </span>
            <span className="text-body-md text-muted">For Sale</span>
          </div>

          {/* Share */}
          <div className="mt-4">
            <ShareBar title={property.title} />
          </div>

          {/* Specs grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {property.bedrooms != null && (
              <div className="bg-surface rounded-md border border-hairline p-4 text-center">
                <p className="text-h3 font-semibold text-ink">{property.bedrooms}</p>
                <p className="text-body-sm text-muted mt-1">Bedrooms</p>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="bg-surface rounded-md border border-hairline p-4 text-center">
                <p className="text-h3 font-semibold text-ink">{property.bathrooms}</p>
                <p className="text-body-sm text-muted mt-1">Bathrooms</p>
              </div>
            )}
            {property.area_sqft != null && (
              <div className="bg-surface rounded-md border border-hairline p-4 text-center">
                <p className="text-h3 font-semibold text-ink">{property.area_sqft.toLocaleString()}</p>
                <p className="text-body-sm text-muted mt-1">Sq Ft</p>
              </div>
            )}
            {property.city && (
              <div className="bg-surface rounded-md border border-hairline p-4 text-center">
                <p className="text-body-sm font-semibold text-ink truncate">{property.city}</p>
                <p className="text-body-sm text-muted mt-1">Location</p>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="mt-8">
              <h2 className="text-h3 font-semibold text-ink mb-3">About this property</h2>
              <p className="text-body-md text-body leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-h3 font-semibold text-ink mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 bg-surface rounded-sm border border-hairline px-4 py-3"
                  >
                    <span aria-hidden="true">{getAmenityIcon(amenity)}</span>
                    <span className="text-body-sm text-ink">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mortgage Calculator */}
          <div className="mt-8">
            <MortgageCalculator propertyPrice={property.price} />
          </div>
        </div>

        {/* Right: Agent sidebar */}
        {agent && (
          <div className="lg:sticky lg:top-24">
            <AgentCard agent={agent} propertyId={property.id} />
          </div>
        )}
      </div>

      <SimilarListings
        currentId={property.id}
        city={property.city}
        propertyType={property.property_type}
        price={property.price}
      />
      <RecentlyViewed propertyId={property.id} />
    </div>
  );
}

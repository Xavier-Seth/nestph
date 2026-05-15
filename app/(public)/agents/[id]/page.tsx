import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AgentStatsGrid } from "@/components/agents/AgentStatsGrid";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Agent, Property } from "@/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("agents")
    .select("name, bio")
    .eq("id", id)
    .eq("status", "approved")
    .single();
  if (!data) return { title: "Agent Not Found" };
  return {
    title: data.name,
    description: data.bio ?? `${data.name} — Real Estate Agent at NestPH`,
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch agent
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single<Agent>();

  if (!agent) notFound();

  // Count properties sold
  const { count: soldCount } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("agent_id", id)
    .eq("status", "sold");

  // Active listings
  const { data: listings } = await supabase
    .from("properties")
    .select("id, agent_id, title, description, price, property_type, status, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, images, amenities, featured, created_at, updated_at")
    .eq("agent_id", id)
    .eq("status", "for_sale")
    .order("created_at", { ascending: false })
    .limit(9)
    .returns<Property[]>();

  const activeListings = listings ?? [];

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted hover:text-ink transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All Agents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
        {/* Left: Profile card */}
        <div className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden bg-secondary-container">
            {agent.avatar_url ? (
              <Image
                src={agent.avatar_url}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[4rem] font-semibold text-primary">
                  {agent.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name + title */}
          <div>
            <h1 className="text-h2 font-semibold text-ink">{agent.name}</h1>
            <p className="text-body-md text-muted mt-1">Real Estate Agent</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            {agent.email && (
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-2.5 text-body-sm text-muted hover:text-ink transition-colors"
              >
                <EmailIcon />
                <span className="truncate">{agent.email}</span>
              </a>
            )}
            {agent.phone && (
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center gap-2.5 text-body-sm text-muted hover:text-ink transition-colors"
              >
                <PhoneIcon />
                <span>{agent.phone}</span>
              </a>
            )}
          </div>

          {/* Facebook Messenger */}
          {agent.fb_username && (
            <a
              href={`https://m.me/${agent.fb_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-sm bg-[#1877F2] text-white text-body-sm font-medium hover:bg-[#166fe5] transition-colors duration-150"
            >
              <FacebookIcon />
              Message on Facebook
            </a>
          )}

          {/* Inquire CTA */}
          <Link
            href="/contact"
            className="flex items-center justify-center h-10 px-4 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150"
          >
            Send Inquiry
          </Link>
        </div>

        {/* Right: Stats + Bio + Listings */}
        <div className="min-w-0">
          {/* Stats */}
          <AgentStatsGrid
            propertiesSold={soldCount ?? 0}
            yearsExperience={agent.years_experience}
          />

          {/* Bio */}
          {agent.bio && (
            <div className="mt-8">
              <h2 className="text-h3 font-semibold text-ink mb-3">About</h2>
              <p className="text-body-md text-body leading-relaxed whitespace-pre-line">
                {agent.bio}
              </p>
            </div>
          )}

          {/* Active Listings */}
          <div className="mt-10">
            <h2 className="text-h3 font-semibold text-ink mb-5">
              Active Listings
              {activeListings.length > 0 && (
                <span className="ml-2 text-body-md font-normal text-muted">
                  ({activeListings.length})
                </span>
              )}
            </h2>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeListings.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-hairline rounded-md bg-surface">
                <p className="text-body-md text-muted">No active listings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.06 6.06l1.28-1.28a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

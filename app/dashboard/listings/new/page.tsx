import Link from "next/link";
import type { Metadata } from "next";
import { ListingForm } from "@/components/dashboard/ListingForm";
import { createListing } from "../actions";

export const metadata: Metadata = { title: "New Listing" };

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/listings"
          className="text-body-sm text-muted hover:text-ink transition-colors"
        >
          ← My Listings
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-h3 font-semibold text-ink">New Listing</h1>
      </div>

      <ListingForm
        action={createListing}
        error={params.error}
        submitLabel="Create Listing"
      />
    </div>
  );
}

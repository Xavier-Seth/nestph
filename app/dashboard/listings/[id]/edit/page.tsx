import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ListingForm } from "@/components/dashboard/ListingForm";
import { updateListing } from "../../actions";
import type { Property } from "@/types";

export const metadata: Metadata = { title: "Edit Listing" };

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("agent_id", user.id)
    .single<Property>();

  if (!property) notFound();

  async function update(formData: FormData) {
    "use server";
    await updateListing(id, formData);
  }

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
        <h1 className="text-h3 font-semibold text-ink">Edit Listing</h1>
      </div>

      <ListingForm
        action={update}
        initial={property}
        error={sp.error}
        submitLabel="Save Changes"
      />
    </div>
  );
}

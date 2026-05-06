"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingSchema } from "@/lib/validations/listing";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    property_type: formData.get("property_type"),
    status: formData.get("status"),
    bedrooms: formData.get("bedrooms") || null,
    bathrooms: formData.get("bathrooms") || null,
    area_sqft: formData.get("area_sqft") || null,
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip_code: formData.get("zip_code") || null,
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
  };

  const parsed = ListingSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/dashboard/listings/new?error=validation");
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...parsed.data, agent_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/dashboard/listings/new?error=db");
  }

  redirect("/dashboard/listings");
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    property_type: formData.get("property_type"),
    status: formData.get("status"),
    bedrooms: formData.get("bedrooms") || null,
    bathrooms: formData.get("bathrooms") || null,
    area_sqft: formData.get("area_sqft") || null,
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip_code: formData.get("zip_code") || null,
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
  };

  const parsed = ListingSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/dashboard/listings/${id}/edit?error=validation`);
  }

  const { error } = await supabase
    .from("properties")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("agent_id", user.id);

  if (error) {
    redirect(`/dashboard/listings/${id}/edit?error=db`);
  }

  redirect("/dashboard/listings");
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("agent_id", user.id);

  redirect("/dashboard/listings");
}

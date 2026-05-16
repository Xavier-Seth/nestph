import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";
import type { Agent } from "@/types";

export const metadata: Metadata = { title: "Edit Profile — NestPH" };

type ProfileAgent = Pick<
  Agent,
  | "name"
  | "email"
  | "phone"
  | "bio"
  | "years_experience"
  | "fb_username"
  | "avatar_url"
  | "status"
  | "created_at"
>;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const serviceClient = createServiceClient();
  const { data: agent } = await serviceClient
    .from("agents")
    .select(
      "name, email, phone, bio, years_experience, fb_username, avatar_url, status, created_at"
    )
    .eq("id", user.id)
    .single<ProfileAgent>();

  if (!agent) redirect("/auth/login");

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-h2 font-semibold text-ink">Edit Profile</h1>
        <p className="text-body-sm text-muted mt-1">
          Update your public agent profile visible to buyers
        </p>
      </div>
      <ProfileForm agent={agent} />
    </div>
  );
}

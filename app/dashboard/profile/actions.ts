"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AgentProfileSchema } from "@/lib/validations/agent";

export interface ProfileActionState {
  success: boolean;
  error: string | null;
}

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated." };

  // --- Avatar upload (optional) ---
  let avatarUrl: string | undefined;
  const avatarFile = formData.get("avatar");

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_MIME.includes(avatarFile.type)) {
      return { success: false, error: "Avatar must be a JPG, PNG, or WebP image." };
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return { success: false, error: "Avatar must be under 2 MB." };
    }

    const ext = avatarFile.type.split("/")[1];
    const storagePath = `${user.id}/avatar.${ext}`;
    const serviceClient = createServiceClient();

    const { error: uploadError } = await serviceClient.storage
      .from("avatars")
      .upload(storagePath, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) {
      return { success: false, error: "Failed to upload avatar. Please try again." };
    }

    const { data: urlData } = serviceClient.storage
      .from("avatars")
      .getPublicUrl(storagePath);

    // Bust the CDN cache by appending a timestamp query param
    avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
  }

  // --- Text field validation ---
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    bio: formData.get("bio"),
    years_experience: formData.get("years_experience"),
    fb_username: formData.get("fb_username"),
  };

  const parsed = AgentProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // --- DB update ---
  const updatePayload: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };
  if (avatarUrl !== undefined) {
    updatePayload.avatar_url = avatarUrl;
  }

  const { error: dbError } = await supabase
    .from("agents")
    .update(updatePayload)
    .eq("id", user.id);

  if (dbError) {
    return { success: false, error: "Failed to save profile. Please try again." };
  }

  return { success: true, error: null };
}

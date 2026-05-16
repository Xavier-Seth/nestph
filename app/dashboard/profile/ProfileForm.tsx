"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "./actions";
import type { Agent } from "@/types";

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

interface ProfileFormProps {
  agent: ProfileAgent;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  approved: { label: "Approved", className: "bg-green-100 text-green-800" },
  pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800" },
  suspended: { label: "Suspended", className: "bg-error/10 text-error" },
};

export function ProfileForm({ agent }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    error: null,
  });

  const [bio, setBio] = useState(agent.bio ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    agent.avatar_url ?? null
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Release previous object URL if it was locally created
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  const statusInfo =
    STATUS_CONFIG[agent.status] ?? STATUS_CONFIG.pending;

  const memberSince = new Date(agent.created_at).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const initial = agent.name.charAt(0).toUpperCase();

  return (
    <form action={formAction} className="space-y-6">
      {/* Banners */}
      {state.success && (
        <div className="px-4 py-3 rounded-sm bg-green-50 border border-green-200 text-body-sm text-green-800">
          Profile updated successfully.
        </div>
      )}
      {state.error && (
        <div className="px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
          {state.error}
        </div>
      )}

      {/* Account Details — read-only */}
      <div className="bg-surface border border-hairline rounded-md">
        <div className="px-5 py-4 border-b border-hairline">
          <h2 className="text-body-md font-semibold text-ink">Account Details</h2>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-caption text-muted uppercase tracking-wide">Email</p>
            <p className="text-body-sm text-ink mt-1 break-all">{agent.email}</p>
          </div>
          <div>
            <p className="text-caption text-muted uppercase tracking-wide">Status</p>
            <span
              className={`inline-block mt-1 text-caption px-2 py-0.5 rounded-full font-medium ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <div>
            <p className="text-caption text-muted uppercase tracking-wide">Member Since</p>
            <p className="text-body-sm text-ink mt-1">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-surface border border-hairline rounded-md">
        <div className="px-5 py-4 border-b border-hairline">
          <h2 className="text-body-md font-semibold text-ink">Profile Photo</h2>
        </div>
        <div className="px-5 py-4 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shrink-0 overflow-hidden border border-hairline">
            {previewUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-h2 font-semibold text-primary">{initial}</span>
            )}
          </div>
          <div>
            <input
              type="file"
              name="avatar"
              id="avatar-upload"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center px-4 py-2 rounded-sm border border-hairline text-body-sm font-medium text-ink bg-canvas hover:bg-surface-soft transition-colors cursor-pointer"
            >
              Choose Photo
            </label>
            <p className="text-caption text-muted mt-2">JPG, PNG, or WebP · Max 2 MB</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-surface border border-hairline rounded-md">
        <div className="px-5 py-4 border-b border-hairline">
          <h2 className="text-body-md font-semibold text-ink">Profile Information</h2>
        </div>
        <div className="px-5 py-5 space-y-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-body-sm font-medium text-ink">
              Full Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={agent.name}
              maxLength={100}
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-body-sm font-medium text-ink">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={agent.phone ?? ""}
              placeholder="+63 9XX XXX XXXX"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="bio" className="text-body-sm font-medium text-ink">Bio</label>
              <span
                className={`text-caption tabular-nums ${bio.length > 450 ? "text-error" : "text-muted"}`}
              >
                {bio.length}/500
              </span>
            </div>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell buyers about yourself, your experience, and the areas you specialise in..."
              className="w-full rounded-sm border border-hairline px-3 py-2.5 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          {/* Years of Experience */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="years_experience" className="text-body-sm font-medium text-ink">
              Years of Experience
            </label>
            <input
              id="years_experience"
              name="years_experience"
              type="number"
              min={0}
              max={50}
              defaultValue={agent.years_experience ?? ""}
              placeholder="0"
              className="h-10 w-32 rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Facebook Username */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fb_username" className="text-body-sm font-medium text-ink">
              Facebook Username
            </label>
            <div className="flex items-center">
              <span className="h-10 flex items-center px-3 rounded-l-sm border border-r-0 border-hairline bg-surface-soft text-body-sm text-muted select-none shrink-0">
                m.me/
              </span>
              <input
                id="fb_username"
                name="fb_username"
                type="text"
                defaultValue={agent.fb_username ?? ""}
                placeholder="yourpage"
                maxLength={50}
                className="h-10 flex-1 min-w-0 rounded-r-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <p className="text-caption text-muted">
              No spaces or @ symbol. Shown as a Messenger contact link on your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto h-11 px-8 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

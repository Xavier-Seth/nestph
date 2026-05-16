"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Props {
  className?: string;
  label?: string;
}

export function DashboardSignOut({ className, label = "Sign Out" }: Props) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
    } catch {
      // navigate regardless of signOut error
    }
    window.location.href = "/auth/login";
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={signingOut}
        className={className}
      >
        {signingOut ? "Signing out..." : label}
      </button>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Sign out?"
        description="You will be returned to the login page."
        confirmLabel="Sign Out"
        onConfirm={handleSignOut}
      />
    </>
  );
}

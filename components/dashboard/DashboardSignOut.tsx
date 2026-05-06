"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  className?: string;
  label?: string;
}

export function DashboardSignOut({ className, label = "Sign Out" }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className={className}>
      {label}
    </button>
  );
}

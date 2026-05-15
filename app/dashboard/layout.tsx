import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Agent } from "@/types";
import { DashboardSignOut } from "@/components/dashboard/DashboardSignOut";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Listings", href: "/dashboard/listings" },
  { label: "Inquiries", href: "/dashboard/inquiries" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const serviceClient = createServiceClient();
  const { data: agent } = await serviceClient
    .from("agents")
    .select("id, name, email, role, status")
    .eq("id", user.id)
    .single<Pick<Agent, "id" | "name" | "email" | "role" | "status">>();

  if (!agent) redirect("/auth/login");

  const isApproved =
    agent.role === "super_admin" ||
    (agent.role === "agent" && agent.status === "approved");

  if (!isApproved && agent.status === "suspended") {
    redirect("/auth/login?error=suspended");
  }

  if (!isApproved) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-h3 font-semibold text-ink">Account Pending Approval</h1>
          <p className="text-body-md text-muted mt-3 leading-relaxed">
            Your agent account is under review. You&apos;ll receive access once a Super Admin
            approves your registration.
          </p>
          <p className="text-body-sm text-muted mt-2">Registered as: {agent.email}</p>
          <DashboardSignOut className="mt-6 h-10 px-6 rounded-sm border border-hairline text-body-sm font-medium text-ink hover:bg-surface-soft transition-colors" label="Sign Out" />
        </div>
      </div>
    );
  }

  const initial = agent.name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-hairline bg-surface flex flex-col">
        <div className="p-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-body-sm font-semibold">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-body-sm font-medium text-ink truncate">{agent.name}</p>
              <p className="text-caption text-muted truncate">
                {agent.role === "super_admin" ? "Super Admin" : "Agent"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5" aria-label="Dashboard">
          {NAV_ITEMS.map((item) => (
            <DashboardNavLink key={item.href} href={item.href} label={item.label} />
          ))}
          {agent.role === "super_admin" && (
            <Link
              href="/admin"
              className="px-3 py-2 rounded-sm text-body-sm font-medium text-body hover:text-ink hover:bg-surface-soft transition-colors duration-150"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-3 border-t border-hairline">
          <DashboardSignOut
            className="w-full text-left px-3 py-2 rounded-sm text-body-sm font-medium text-body hover:text-ink hover:bg-surface-soft transition-colors duration-150"
            label="Sign Out"
          />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

function DashboardNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-sm text-body-sm font-medium text-body hover:text-ink hover:bg-surface-soft transition-colors duration-150"
    >
      {label}
    </Link>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const service = createServiceClient();
  const { data: agent } = await service
    .from("agents")
    .select("id, name, role, bio, phone, avatar_url")
    .eq("id", user.id)
    .single();

  if (!agent) redirect("/auth/login");

  const agentId = agent.id;

  const [
    { count: activeCount },
    { count: soldCount },
    { count: newInquiries },
    { count: totalInquiries },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("status", "for_sale"),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("status", "sold"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("status", "new"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId),
  ]);

  const { data: recentListings } = await supabase
    .from("properties")
    .select("id, title, price, status, city, created_at")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, status, created_at, property:properties(title)")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(5);

  const firstName = agent.name.split(" ")[0];

  const stats = [
    { label: "Active Listings", value: activeCount ?? 0, href: "/dashboard/listings" },
    { label: "Properties Sold", value: soldCount ?? 0, href: "/dashboard/listings" },
    { label: "New Inquiries", value: newInquiries ?? 0, href: "/dashboard/inquiries" },
    { label: "Total Inquiries", value: totalInquiries ?? 0, href: "/dashboard/inquiries" },
  ];

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function fmtPrice(n: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  const STATUS_LABEL: Record<string, string> = {
    for_sale: "For Sale",
    sold: "Sold",
    pending: "Pending",
  };

  const INQUIRY_STATUS_CLASS: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    read: "bg-surface-soft text-muted",
    replied: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-h2 font-semibold text-ink">Welcome back, {firstName}</h1>
        <p className="text-body-sm text-muted mt-1">
          {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Onboarding checklist — only shown to newly approved agents */}
      {agent.role === "agent" && (
        <div className="mb-6">
          <OnboardingChecklist
            agent={{
              id: agent.id,
              bio: agent.bio ?? null,
              phone: agent.phone ?? null,
              avatar_url: agent.avatar_url ?? null,
            }}
            listingsCount={(activeCount ?? 0) + (soldCount ?? 0)}
            inquiriesCount={totalInquiries ?? 0}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-surface border border-hairline rounded-md p-5 hover:shadow-card transition-shadow duration-150"
          >
            <p className="text-caption text-muted uppercase tracking-wide">{s.label}</p>
            <p className="text-h2 font-semibold text-ink mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-surface border border-hairline rounded-md">
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <h2 className="text-body-md font-semibold text-ink">Recent Listings</h2>
            <Link href="/dashboard/listings/new" className="text-body-sm text-primary hover:underline font-medium">
              + New
            </Link>
          </div>
          {!recentListings?.length ? (
            <div className="px-5 py-8 text-center text-body-sm text-muted">
              No listings yet.{" "}
              <Link href="/dashboard/listings/new" className="text-primary hover:underline">
                Create your first listing
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {recentListings.map((p) => (
                <li key={p.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-sm font-medium text-ink truncate">{p.title}</p>
                    <p className="text-caption text-muted">{p.city} · {fmtDate(p.created_at)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-body-sm font-medium text-ink">{fmtPrice(p.price)}</p>
                    <p className="text-caption text-muted">{STATUS_LABEL[p.status]}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-surface border border-hairline rounded-md">
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <h2 className="text-body-md font-semibold text-ink">Recent Inquiries</h2>
            <Link href="/dashboard/inquiries" className="text-body-sm text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          {!recentInquiries?.length ? (
            <div className="px-5 py-8 text-center text-body-sm text-muted">
              No inquiries yet.
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {recentInquiries.map((inq) => {
                const prop = (inq.property as unknown) as { title: string } | null;
                return (
                  <li key={inq.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-body-sm font-medium text-ink truncate">{inq.name}</p>
                      <p className="text-caption text-muted truncate">{prop?.title ?? "General inquiry"}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`text-caption px-2 py-0.5 rounded-full font-medium ${INQUIRY_STATUS_CLASS[inq.status]}`}>
                        {inq.status}
                      </span>
                      <span className="text-caption text-muted">{fmtDate(inq.created_at)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

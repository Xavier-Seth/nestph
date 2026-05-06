import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { deleteListing } from "./actions";

export const metadata: Metadata = { title: "My Listings" };

const STATUS_LABEL: Record<string, string> = {
  for_sale: "For Sale",
  sold: "Sold",
  pending: "Pending",
};

const STATUS_CLASS: Record<string, string> = {
  for_sale: "bg-green-100 text-green-800",
  sold: "bg-surface-soft text-muted",
  pending: "bg-yellow-100 text-yellow-800",
};

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: listings } = await supabase
    .from("properties")
    .select("id, title, price, status, city, property_type, images, created_at")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  function fmtPrice(n: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-semibold text-ink">My Listings</h1>
          <p className="text-body-sm text-muted mt-1">{listings?.length ?? 0} properties</p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="h-9 px-4 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150 inline-flex items-center gap-2"
        >
          <span aria-hidden="true">+</span> New Listing
        </Link>
      </div>

      {!listings?.length ? (
        <div className="border border-hairline rounded-md bg-surface py-20 text-center">
          <p className="text-body-md text-muted">You have no listings yet.</p>
          <Link
            href="/dashboard/listings/new"
            className="mt-4 inline-flex h-9 px-4 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors items-center"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="border border-hairline rounded-md overflow-hidden bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-hairline bg-surface-soft">
              <tr>
                <th className="px-4 py-3 text-body-sm font-medium text-muted">Property</th>
                <th className="px-4 py-3 text-body-sm font-medium text-muted hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-body-sm font-medium text-muted">Price</th>
                <th className="px-4 py-3 text-body-sm font-medium text-muted hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-body-sm font-medium text-muted hidden lg:table-cell">Added</th>
                <th className="px-4 py-3 text-body-sm font-medium text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {listings.map((p) => {
                const thumb = p.images?.[0];
                return (
                  <tr key={p.id} className="hover:bg-surface-soft transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-sm overflow-hidden bg-surface-soft shrink-0">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt=""
                              width={48}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-caption">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-ink truncate max-w-[14rem]">{p.title}</p>
                          <p className="text-caption text-muted">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-body-sm text-muted capitalize">{p.property_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-body-sm font-medium text-ink">{fmtPrice(p.price)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-caption px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-body-sm text-muted">{fmtDate(p.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${p.id}`}
                          className="text-caption text-muted hover:text-ink transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/listings/${p.id}/edit`}
                          className="text-caption text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteListing(p.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-caption text-error hover:underline"
                            onClick={() => {}}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

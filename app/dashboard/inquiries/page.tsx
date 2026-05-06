import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inquiries" };

const STATUS_CLASS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-surface-soft text-muted",
  replied: "bg-green-100 text-green-800",
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, phone, message, status, created_at, property:properties(id, title)")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  async function markRead(id: string) {
    "use server";
    const supabase2 = await createClient();
    await supabase2.from("inquiries").update({ status: "read" }).eq("id", id);
  }

  async function markReplied(id: string) {
    "use server";
    const supabase2 = await createClient();
    await supabase2.from("inquiries").update({ status: "replied" }).eq("id", id);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-h2 font-semibold text-ink">Inquiries</h1>
        <p className="text-body-sm text-muted mt-1">{inquiries?.length ?? 0} total</p>
      </div>

      {!inquiries?.length ? (
        <div className="border border-hairline rounded-md bg-surface py-20 text-center">
          <p className="text-body-md text-muted">No inquiries yet.</p>
          <p className="text-body-sm text-muted mt-1">Inquiries from your property listings will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {inquiries.map((inq) => {
            const prop = (inq.property as unknown) as { id: string; title: string } | null;
            return (
              <div
                key={inq.id}
                className="border border-hairline rounded-md bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-body-md font-semibold text-ink">{inq.name}</p>
                      <span className={`text-caption px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[inq.status]}`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-body-sm text-primary hover:underline"
                      >
                        {inq.email}
                      </a>
                      {inq.phone && (
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-body-sm text-muted hover:text-ink"
                        >
                          {inq.phone}
                        </a>
                      )}
                    </div>
                    {prop && (
                      <p className="text-body-sm text-muted mt-1">
                        Re:{" "}
                        <a
                          href={`/properties/${prop.id}`}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {prop.title}
                        </a>
                      </p>
                    )}
                  </div>
                  <p className="text-caption text-muted shrink-0">{fmtDate(inq.created_at)}</p>
                </div>

                <p className="mt-3 text-body-sm text-body leading-relaxed border-l-2 border-hairline pl-3">
                  {inq.message}
                </p>

                {inq.status !== "replied" && (
                  <div className="mt-3 flex gap-2">
                    {inq.status === "new" && (
                      <form action={async () => { "use server"; await markRead(inq.id); }}>
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-sm border border-hairline text-caption font-medium text-ink hover:bg-surface-soft transition-colors"
                        >
                          Mark as Read
                        </button>
                      </form>
                    )}
                    <form action={async () => { "use server"; await markReplied(inq.id); }}>
                      <button
                        type="submit"
                        className="h-8 px-3 rounded-sm bg-primary text-white text-caption font-medium hover:bg-primary-dark transition-colors"
                      >
                        Mark as Replied
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

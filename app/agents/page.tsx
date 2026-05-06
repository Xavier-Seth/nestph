import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/types";

export const metadata: Metadata = {
  title: "Our Agents",
  description: "Meet the licensed real estate agents at NestPH serving Cebu City, Mandaue, Lapu-Lapu, and Talisay.",
};

export default async function AgentsPage() {
  const supabase = await createClient();

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .returns<Agent[]>();

  const agentList = agents ?? [];

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-h1 font-semibold text-ink">Our Agents</h1>
        <p className="text-body-lg text-muted mt-2">
          Experienced, licensed real estate professionals who know the Cebu market
        </p>
      </div>

      {agentList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {agentList.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="group block"
            >
              <div className="bg-surface-card rounded-md border border-hairline overflow-hidden transition-shadow duration-200 hover:shadow-card p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-secondary-container mb-4 shrink-0">
                  {agent.avatar_url ? (
                    <Image
                      src={agent.avatar_url}
                      alt={agent.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-h2 font-semibold text-primary">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h2 className="text-body-md font-semibold text-ink group-hover:text-primary transition-colors">
                  {agent.name}
                </h2>
                <p className="text-body-sm text-muted mt-0.5">Real Estate Agent</p>
                {agent.years_experience > 0 && (
                  <p className="text-caption text-muted mt-1">
                    {agent.years_experience}{" "}
                    {agent.years_experience === 1 ? "year" : "years"} experience
                  </p>
                )}
                {agent.bio && (
                  <p className="text-body-sm text-muted mt-3 line-clamp-2 leading-relaxed">
                    {agent.bio}
                  </p>
                )}

                <div className="mt-4 w-full">
                  <span className="inline-flex items-center justify-center w-full h-9 rounded-sm border border-primary text-primary text-body-sm font-medium group-hover:bg-secondary-container transition-colors duration-150">
                    View Profile
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-hairline rounded-md bg-surface">
          <p className="text-body-lg text-muted">No agents listed yet.</p>
          <p className="text-body-sm text-muted mt-2">
            Check back soon or{" "}
            <Link href="/become-an-agent" className="text-primary hover:text-primary-dark underline">
              join as an agent
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/types";

export async function MeetOurAgents() {
  const supabase = await createClient();

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("status", "approved")
    .limit(4)
    .returns<Agent[]>();

  const agentList = agents ?? [];

  return (
    <section className="py-16 bg-canvas">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <h2 className="text-h2 font-semibold text-ink">Meet Our Agents</h2>
            <p className="text-body-md text-muted mt-2">
              Partner with experienced, licensed real estate professionals who know
              the Cebu market inside and out.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/agents"
              className="h-10 px-5 rounded-sm border border-primary text-primary text-body-sm font-medium hover:bg-secondary-container transition-colors duration-150 inline-flex items-center"
            >
              Browse Agents
            </Link>
            <Link
              href="/become-an-agent"
              className="h-10 px-5 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150 inline-flex items-center"
            >
              Join as Agent
            </Link>
          </div>
        </div>

        {agentList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {agentList.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group flex flex-col items-center text-center gap-3"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-secondary-container shrink-0">
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
                <div>
                  <p className="text-body-md font-semibold text-ink group-hover:text-primary transition-colors">
                    {agent.name}
                  </p>
                  <p className="text-body-sm text-muted">Real Estate Agent</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-hairline rounded-md bg-surface">
            <p className="text-body-md text-muted">No agents listed yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

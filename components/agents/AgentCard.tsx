import Image from "next/image";
import Link from "next/link";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  propertyId?: string;
}

export function AgentCard({ agent, propertyId }: AgentCardProps) {
  const inquiryHref = propertyId
    ? `/contact?property_id=${propertyId}`
    : "/contact";

  return (
    <div className="bg-surface rounded-md border border-hairline p-5">
      <h3 className="text-body-sm font-semibold text-muted uppercase tracking-wide mb-4">
        Listed by
      </h3>

      <Link
        href={`/agents/${agent.id}`}
        className="flex items-center gap-3 group mb-4"
      >
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-soft shrink-0">
          {agent.avatar_url ? (
            <Image
              src={agent.avatar_url}
              alt={agent.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-container">
              <span className="text-h3 font-semibold text-primary">
                {agent.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-body-md font-semibold text-ink group-hover:text-primary transition-colors truncate">
            {agent.name}
          </p>
          <p className="text-body-sm text-muted">Real Estate Agent</p>
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        {agent.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center gap-2 text-body-sm text-muted hover:text-ink transition-colors"
          >
            <PhoneIcon />
            <span>{agent.phone}</span>
          </a>
        )}
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center gap-2 text-body-sm text-muted hover:text-ink transition-colors truncate"
          >
            <EmailIcon />
            <span className="truncate">{agent.email}</span>
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={inquiryHref}
          className="flex items-center justify-center h-10 px-4 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150"
        >
          Send Inquiry
        </Link>
        {agent.fb_username && (
          <a
            href={`https://m.me/${agent.fb_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-sm border border-hairline text-body-sm font-medium text-ink hover:bg-surface-soft transition-colors duration-150"
          >
            <FacebookIcon />
            Message on Facebook
          </a>
        )}
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.06 6.06l1.28-1.28a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" style={{ color: "#1877F2" }}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

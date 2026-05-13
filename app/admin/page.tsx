import { createServiceClient } from '@/lib/supabase/server';
import Link from 'next/link';

const agentBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
};

const inquiryBadge: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
};

export default async function AdminOverviewPage() {
  const service = createServiceClient();

  const [agentRes, listingRes, inquiryRes, recentAgentRes, recentInquiryRes] = await Promise.all([
    service.from('agents').select('status').neq('role', 'super_admin'),
    service.from('properties').select('status'),
    service.from('inquiries').select('status'),
    service
      .from('agents')
      .select('id, name, email, status, created_at')
      .neq('role', 'super_admin')
      .order('created_at', { ascending: false })
      .limit(6),
    service
      .from('inquiries')
      .select('id, name, status, message, created_at, properties(title)')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const agents = agentRes.data ?? [];
  const listings = listingRes.data ?? [];
  const inquiries = inquiryRes.data ?? [];
  const recentAgents = recentAgentRes.data ?? [];
  const recentInquiries = recentInquiryRes.data ?? [];

  const stats = [
    {
      label: 'Total Agents',
      value: agents.length,
      href: '/admin/agents',
      breakdown: [
        {
          label: 'Pending',
          count: agents.filter((a) => a.status === 'pending').length,
          color: 'text-yellow-600',
        },
        {
          label: 'Approved',
          count: agents.filter((a) => a.status === 'approved').length,
          color: 'text-green-600',
        },
        {
          label: 'Suspended',
          count: agents.filter((a) => a.status === 'suspended').length,
          color: 'text-red-600',
        },
      ],
    },
    {
      label: 'Total Listings',
      value: listings.length,
      href: '/admin/listings',
      breakdown: [
        {
          label: 'For Sale',
          count: listings.filter((l) => l.status === 'for_sale').length,
          color: 'text-blue-600',
        },
        {
          label: 'Pending',
          count: listings.filter((l) => l.status === 'pending').length,
          color: 'text-yellow-600',
        },
        {
          label: 'Sold',
          count: listings.filter((l) => l.status === 'sold').length,
          color: 'text-green-600',
        },
      ],
    },
    {
      label: 'Total Inquiries',
      value: inquiries.length,
      href: '/admin/inquiries',
      breakdown: [
        {
          label: 'New',
          count: inquiries.filter((i) => i.status === 'new').length,
          color: 'text-blue-600',
        },
        {
          label: 'Read',
          count: inquiries.filter((i) => i.status === 'read').length,
          color: 'text-gray-500',
        },
        {
          label: 'Replied',
          count: inquiries.filter((i) => i.status === 'replied').length,
          color: 'text-green-600',
        },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1B3A5C]">Platform Overview</h1>
        <p className="text-sm text-[var(--muted)] mt-1">All-time stats across NestPH</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, href, breakdown }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-md border border-[var(--hairline)] p-6 hover:shadow-md transition-shadow"
            style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
          >
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold text-[#1B3A5C] mb-4">{value}</p>
            <div className="space-y-1.5 border-t border-[var(--hairline)] pt-3">
              {breakdown.map(({ label: sub, count, color }) => (
                <div key={sub} className="flex justify-between text-sm">
                  <span className={`${color} font-medium`}>{sub}</span>
                  <span className="font-semibold text-[var(--ink)]">{count}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-md border border-[var(--hairline)]"
          style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="px-6 py-4 border-b border-[var(--hairline)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Recent Agent Registrations</h2>
            <Link href="/admin/agents" className="text-xs text-[#1B3A5C] hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[var(--hairline)]">
            {recentAgents.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-[var(--muted)]">
                No agents yet.
              </li>
            )}
            {recentAgents.map((a) => {
              const initials = a.name
                .split(' ')
                .filter(Boolean)
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              return (
                <li key={a.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#1B3A5C] text-xs font-semibold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ink)] truncate">{a.name}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{a.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${agentBadge[a.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {a.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="bg-white rounded-md border border-[var(--hairline)]"
          style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="px-6 py-4 border-b border-[var(--hairline)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-xs text-[#1B3A5C] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[var(--hairline)]">
            {recentInquiries.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-[var(--muted)]">
                No inquiries yet.
              </li>
            )}
            {recentInquiries.map((inq) => {
              const property = inq.properties as unknown as { title: string } | null;
              return (
                <li key={inq.id} className="px-6 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)]">{inq.name}</p>
                      {property && (
                        <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                          {property.title}
                        </p>
                      )}
                      <p className="text-xs text-[var(--body)] line-clamp-1 mt-0.5">
                        {inq.message}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 capitalize ${inquiryBadge[inq.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {inq.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

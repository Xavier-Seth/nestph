import { createServiceClient } from '@/lib/supabase/server';

const statusBadge: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
};

export default async function AdminInquiriesPage() {
  const service = createServiceClient();
  const { data: inquiries } = await service
    .from('inquiries')
    .select(
      'id, name, email, phone, message, status, created_at, properties(title, city), agents(name)',
    )
    .order('created_at', { ascending: false });

  const list = inquiries ?? [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1B3A5C]">Platform Inquiries</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Monitor all client-to-agent inquiries across the network.
        </p>
      </div>

      <div
        className="bg-white rounded-md border border-[var(--hairline)] overflow-x-auto"
        style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)] bg-[var(--surface-soft)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Client
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Property
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Agent
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Message
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((inquiry) => {
              const property = inquiry.properties as unknown as { title: string; city: string } | null;
              const agent = inquiry.agents as unknown as { name: string } | null;
              return (
                <tr
                  key={inquiry.id}
                  className="border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-soft)]"
                >
                  <td className="px-4 py-3 font-medium text-[var(--ink)] whitespace-nowrap">
                    {inquiry.name}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[var(--body)]">{inquiry.email}</p>
                    {inquiry.phone && (
                      <p className="text-xs text-[var(--muted)] mt-0.5">{inquiry.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {property ? (
                      <>
                        <p className="text-[var(--body)] truncate">{property.title}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{property.city}</p>
                      </>
                    ) : (
                      <span className="text-[var(--muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--body)] whitespace-nowrap">
                    {agent?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-[var(--body)] line-clamp-2">{inquiry.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[inquiry.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!list.length && (
          <div className="py-12 text-center text-sm text-[var(--muted)]">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
}

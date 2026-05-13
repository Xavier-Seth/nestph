import { createServiceClient } from '@/lib/supabase/server';
import { AdminAgentActions } from '@/components/admin/AdminAgentActions';

const statusBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
};

export default async function AdminAgentsPage() {
  const service = createServiceClient();
  const { data: agents } = await service
    .from('agents')
    .select('id, name, email, phone, status, created_at')
    .neq('role', 'super_admin')
    .order('created_at', { ascending: false });

  const list = agents ?? [];
  const total = list.length;
  const pending = list.filter((a) => a.status === 'pending').length;
  const active = list.filter((a) => a.status === 'approved').length;
  const suspended = list.filter((a) => a.status === 'suspended').length;

  const statCards = [
    { label: 'Total Agents', value: total, bg: 'bg-[#1B3A5C]' },
    { label: 'Pending', value: pending, bg: 'bg-yellow-500' },
    { label: 'Active', value: active, bg: 'bg-green-500' },
    { label: 'Suspended', value: suspended, bg: 'bg-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1B3A5C]">Agent Management</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Approve, suspend, or remove agents from the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, bg }) => (
          <div key={label} className={`${bg} rounded-md p-5`}>
            <p className="text-xs font-medium text-white/80 mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-md border border-[var(--hairline)] overflow-x-auto"
        style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)] bg-[var(--surface-soft)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Agent
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Phone
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Registered
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((agent) => {
              const initials = agent.name
                .split(' ')
                .filter(Boolean)
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              return (
                <tr
                  key={agent.id}
                  className="border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-soft)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#1B3A5C] text-xs font-semibold">{initials}</span>
                      </div>
                      <span className="font-medium text-[var(--ink)]">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--body)]">{agent.email}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{agent.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[agent.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(agent.created_at).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <AdminAgentActions agentId={agent.id} currentStatus={agent.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!list.length && (
          <div className="py-12 text-center text-sm text-[var(--muted)]">
            No agents registered yet.
          </div>
        )}
      </div>
    </div>
  );
}

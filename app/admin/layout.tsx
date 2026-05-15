import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { DashboardSignOut } from '@/components/dashboard/DashboardSignOut';
import { AdminNavLinks } from '@/components/admin/AdminNavLinks';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const service = createServiceClient();
  const { data: agent } = await service
    .from('agents')
    .select('role, name, email')
    .eq('id', user.id)
    .single();

  if (!agent || agent.role !== 'super_admin') redirect('/auth/login');

  const initials = agent.name
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-[#1B3A5C] flex flex-col shrink-0">
        <div className="px-6 pt-6 pb-5 border-b border-white/10">
          <span className="text-white font-bold text-xl tracking-tight">NestPH</span>
          <p className="text-white/50 text-xs mt-0.5 font-medium uppercase tracking-wider">
            Admin Panel
          </p>
        </div>

        <AdminNavLinks />

        <div className="px-3 py-3 border-t border-white/10 space-y-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
                clipRule="evenodd"
              />
            </svg>
            Agent Dashboard
          </Link>
          <DashboardSignOut
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            label="Sign Out"
          />
        </div>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{agent.name}</p>
            <p className="text-xs text-white/50 truncate">{agent.email}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto bg-[var(--surface)]">{children}</main>
    </div>
  );
}

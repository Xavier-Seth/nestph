import { createServiceClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import DeleteListingButton from '@/components/admin/DeleteListingButton';

const statusBadge: Record<string, string> = {
  for_sale: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-gray-100 text-gray-600',
};

const statusLabel: Record<string, string> = {
  for_sale: 'Active',
  pending: 'Pending',
  sold: 'Sold',
};

export default async function AdminListingsPage() {
  const service = createServiceClient();
  const { data: listings } = await service
    .from('properties')
    .select('id, title, price, property_type, status, city, created_at, images, agents(name)')
    .order('created_at', { ascending: false });

  const list = listings ?? [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1B3A5C]">Listing Management</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage and monitor all active property sales across the platform.
        </p>
      </div>

      <div
        className="bg-white rounded-md border border-[var(--hairline)] overflow-x-auto"
        style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)] bg-[var(--surface-soft)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider w-14">
                Thumbnail
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Agent
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                City
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Listed
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((listing) => {
              const agent = listing.agents as unknown as { name: string } | null;
              const images = listing.images as string[] | null;
              const thumbnail = images?.[0] ?? null;
              return (
                <tr
                  key={listing.id}
                  className="border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-soft)]"
                >
                  <td className="px-4 py-3">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt=""
                        className="w-12 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-10 rounded bg-[var(--surface-soft)] border border-[var(--hairline)]" />
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <Link
                      href={`/properties/${listing.id}`}
                      target="_blank"
                      className="font-medium text-[var(--ink)] hover:text-[#1B3A5C] hover:underline truncate block"
                    >
                      {listing.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--body)]">{agent?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{listing.city}</td>
                  <td className="px-4 py-3 text-[var(--body)] font-medium">
                    {formatPrice(listing.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[listing.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {statusLabel[listing.status] ?? listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(listing.created_at).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteListingButton listingId={listing.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!list.length && (
          <div className="py-12 text-center text-sm text-[var(--muted)]">No listings yet.</div>
        )}
      </div>
    </div>
  );
}

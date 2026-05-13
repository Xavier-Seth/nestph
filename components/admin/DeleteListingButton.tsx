'use client';

import { useTransition } from 'react';
import { adminDeleteListing } from '@/app/admin/listings/actions';

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    const fd = new FormData();
    fd.set('listingId', listingId);
    startTransition(() => adminDeleteListing(fd));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 text-xs font-medium text-[var(--error)] border border-[var(--error)] rounded-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Delete'}
    </button>
  );
}

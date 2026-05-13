'use client';

import { useTransition } from 'react';
import { updateAgentStatus } from '@/app/admin/agents/actions';

interface Props {
  agentId: string;
  currentStatus: string;
}

export default function AgentStatusActions({ agentId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleAction(status: 'approved' | 'suspended') {
    const fd = new FormData();
    fd.set('agentId', agentId);
    fd.set('status', status);
    startTransition(() => updateAgentStatus(fd));
  }

  if (currentStatus === 'pending' || currentStatus === 'suspended') {
    return (
      <button
        onClick={() => handleAction('approved')}
        disabled={isPending}
        className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? '...' : 'Approve'}
      </button>
    );
  }

  if (currentStatus === 'approved') {
    return (
      <button
        onClick={() => handleAction('suspended')}
        disabled={isPending}
        className="px-3 py-1 text-xs font-medium bg-[var(--error)] text-white rounded-sm hover:opacity-90 disabled:opacity-50 transition-colors"
      >
        {isPending ? '...' : 'Suspend'}
      </button>
    );
  }

  return null;
}

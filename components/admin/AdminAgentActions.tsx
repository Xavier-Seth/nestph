'use client';

import { useTransition } from 'react';
import { updateAgentStatus, deleteAgent } from '@/app/admin/agents/actions';

interface Props {
  agentId: string;
  currentStatus: string;
}

export function AdminAgentActions({ agentId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleStatus(status: 'approved' | 'suspended') {
    const fd = new FormData();
    fd.set('agentId', agentId);
    fd.set('status', status);
    startTransition(() => updateAgentStatus(fd));
  }

  function handleDelete() {
    if (!confirm('Delete this agent and all their listings? This cannot be undone.')) return;
    const fd = new FormData();
    fd.set('agentId', agentId);
    startTransition(() => deleteAgent(fd));
  }

  return (
    <div className="flex items-center gap-1">
      {(currentStatus === 'pending' || currentStatus === 'suspended') && (
        <button
          onClick={() => handleStatus('approved')}
          disabled={isPending}
          title="Approve"
          className="p-1.5 rounded text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {currentStatus === 'approved' && (
        <button
          onClick={() => handleStatus('suspended')}
          disabled={isPending}
          title="Suspend"
          className="p-1.5 rounded text-yellow-600 hover:bg-yellow-50 disabled:opacity-40 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9zm5.25 0a.75.75 0 00-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.75z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Delete agent"
        className="p-1.5 rounded text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

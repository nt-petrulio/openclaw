'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type ApprovalStatus = 'draft' | 'approved' | 'rejected';

type Action = {
  label: string;
  nextStatus: ApprovalStatus;
  className: string;
};

const ACTIONS_BY_STATUS: Record<string, Action[]> = {
  draft: [
    {
      label: 'approve',
      nextStatus: 'approved',
      className: 'border-blue-800 text-blue-300 hover:border-blue-400 hover:text-blue-100',
    },
    {
      label: 'reject',
      nextStatus: 'rejected',
      className: 'border-red-900 text-red-300 hover:border-red-500 hover:text-red-100',
    },
  ],
  approved: [
    {
      label: 'reopen draft',
      nextStatus: 'draft',
      className: 'border-yellow-900 text-yellow-300 hover:border-yellow-500 hover:text-yellow-100',
    },
    {
      label: 'reject',
      nextStatus: 'rejected',
      className: 'border-red-900 text-red-300 hover:border-red-500 hover:text-red-100',
    },
  ],
  rejected: [
    {
      label: 'reopen draft',
      nextStatus: 'draft',
      className: 'border-yellow-900 text-yellow-300 hover:border-yellow-500 hover:text-yellow-100',
    },
  ],
};

export default function AgentRunActions({ id, approvalStatus }: { id: string; approvalStatus: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const actions = ACTIONS_BY_STATUS[approvalStatus] ?? [];

  function updateStatus(nextStatus: ApprovalStatus) {
    setError('');
    startTransition(async () => {
      const response = await fetch('/mc/api/agent-runs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approvalStatus: nextStatus }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'failed to update run' }));
        setError(body.error ?? 'failed to update run');
        return;
      }

      router.refresh();
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="mt-3 border-t border-green-950 pt-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={isPending}
            onClick={() => updateStatus(action.nextStatus)}
            className={`border px-3 py-1 text-xs disabled:opacity-50 ${action.className}`}
          >
            {isPending ? 'updating...' : action.label}
          </button>
        ))}
      </div>
      {error && <div className="mt-2 border border-red-950 p-2 text-xs text-red-400">{error}</div>}
    </div>
  );
}

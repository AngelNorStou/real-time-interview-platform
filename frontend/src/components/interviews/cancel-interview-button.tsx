'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { cancelInterview } from '@/lib/api';

export function CancelInterviewButton({ interviewId }: { interviewId: string }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    if (!confirm('Cancel this interview?')) return;

    startTransition(async () => {
      try {
        setError(null);
        const token = await getToken();
        await cancelInterview(interviewId, token);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cancel');
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? 'Cancelling…' : 'Cancel'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
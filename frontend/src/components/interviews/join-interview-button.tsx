'use client';

import Link from 'next/link';
import { Interview } from '@/lib/api';

export function JoinInterviewButton({ interview }: { interview: Interview }) {
  const canJoin =
    !!interview.streamCallId &&
    (interview.status === 'READY' || interview.status === 'IN_PROGRESS');

  if (!canJoin) {
    return (
      <button
        disabled
        title="Available once the interview is ready to start"
        className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed"
      >
        Join
      </button>
    );
  }

  return (
    <Link
      href={`/interviews/${interview.id}/room`}
      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
    >
      Join
    </Link>
  );
}
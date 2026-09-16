'use client';

import Link from 'next/link';
import { Interview } from '@/lib/api';

const JOIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes before scheduled time

export function JoinInterviewButton({
  interview,
  now,
}: {
  interview: Interview;
  now: number;
}) {
  const scheduledTime = new Date(interview.scheduledAt).getTime();
  const withinWindow = now >= scheduledTime - JOIN_WINDOW_MS;

  const canJoin =
    !!interview.streamCallId &&
    (interview.status === 'IN_PROGRESS' ||
      (interview.status === 'SCHEDULED' && withinWindow));

  if (!canJoin) {
    return (
      <button
        disabled
        title="Available 10 minutes before the scheduled time"
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
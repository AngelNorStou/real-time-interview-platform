'use client';

import Link from 'next/link';
import { Interview } from '@/lib/api';
import { StatusBadge } from './status-badge';
import { JoinInterviewButton } from './join-interview-button';
import { CancelInterviewButton } from './cancel-interview-button';

export function InterviewCard({
  interview,
  currentClerkId,
  now,
}: {
  interview: Interview;
  currentClerkId: string;
  now: number;
}) {
  const isInterviewer = interview.interviewer.clerkId === currentClerkId;
  const otherParty = isInterviewer ? interview.candidate : interview.interviewer;
  const otherLabel = isInterviewer ? 'Candidate' : 'Interviewer';

  const scheduledDate = new Date(interview.scheduledAt);
  const isCancelable =
    interview.status !== 'CANCELLED' && interview.status !== 'COMPLETED';

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-cyan-100">{interview.title}</h3>
          <p className="text-sm text-sky-300/80">
            {otherLabel}: {otherParty.name ?? otherParty.email}
          </p>
        </div>
        <StatusBadge status={interview.status} />
      </div>

      <div className="mt-3 text-sm text-slate-300">
        <p>
          {scheduledDate.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}{' '}
          ·{' '}
          {scheduledDate.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
        <p>{interview.duration} min</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/interviews/${interview.id}`}
          className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
        >
          View details
        </Link>
        <JoinInterviewButton interview={interview} now={now} />
        {isCancelable && <CancelInterviewButton interviewId={interview.id} />}
      </div>
    </div>
  );
}
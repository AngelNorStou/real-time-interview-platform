import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getInterview, getFeedback } from '@/lib/api';
import { getNow } from '@/lib/time';
import { StatusBadge } from '@/components/interviews/status-badge';
import { JoinInterviewButton } from '@/components/interviews/join-interview-button';
import { CancelInterviewButton } from '@/components/interviews/cancel-interview-button';
import { CopyLinkButton } from '@/components/interviews/copy-link-button';
import { FeedbackSection } from '@/components/interviews/feedback-section';
import { PresenceIndicator } from '@/components/interviews/presence-indicator';

export default async function InterviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/interviews/${id}`)}`);

  const token = await getToken();
  const interview = await getInterview(id, token);
  const now = getNow();

  const isCancelable =
    interview.status !== 'CANCELLED' && interview.status !== 'COMPLETED';
  const isInterviewer = interview.interviewer.clerkId === userId;
  const feedbackUnlocked =
    interview.status === 'IN_PROGRESS' || interview.status === 'COMPLETED';

  const otherPartyClerkId = isInterviewer
    ? interview.candidate.clerkId
    : interview.interviewer.clerkId;
  const otherPartyLabel = isInterviewer ? 'Candidate' : 'Interviewer';

  let existingFeedback = null;
  if (isInterviewer) {
    try {
      existingFeedback = await getFeedback(id, token);
    } catch {
      existingFeedback = null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link href="/dashboard" className="text-sm text-cyan-300 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-cyan-100">{interview.title}</h1>
          <StatusBadge status={interview.status} />
        </div>

        <div className="mt-2">
          <PresenceIndicator
            interviewId={interview.id}
            otherPartyClerkId={otherPartyClerkId}
            otherPartyLabel={otherPartyLabel}
          />
        </div>

        {interview.description && (
          <p className="mt-2 text-sm text-slate-300">{interview.description}</p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-slate-200">
          <dt className="text-sky-400">Scheduled</dt>
          <dd>{new Date(interview.scheduledAt).toLocaleString()}</dd>

          <dt className="text-sky-400">Duration</dt>
          <dd>{interview.duration} min</dd>

          <dt className="text-sky-400">Interviewer</dt>
          <dd>{interview.interviewer.name ?? interview.interviewer.email}</dd>

          <dt className="text-sky-400">Candidate</dt>
          <dd>{interview.candidate.name ?? interview.candidate.email}</dd>
        </dl>

        <div className="mt-6 flex items-center gap-2">
          <JoinInterviewButton interview={interview} now={now} />
          <CopyLinkButton interviewId={interview.id} />
          {isCancelable && <CancelInterviewButton interviewId={interview.id} />}
        </div>
      </div>

      {isInterviewer &&
        (feedbackUnlocked ? (
          <FeedbackSection interviewId={interview.id} existingFeedback={existingFeedback} />
        ) : (
          <p className="mt-6 text-sm text-slate-400">
            Feedback can be submitted once the interview has started.
          </p>
        ))}
    </div>
  );
}
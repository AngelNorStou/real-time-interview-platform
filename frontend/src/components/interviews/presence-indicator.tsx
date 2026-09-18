'use client';

import { useInterviewSocket } from '@/hooks/use-interview-socket';

export function PresenceIndicator({
  interviewId,
  otherPartyClerkId,
  otherPartyLabel,
}: {
  interviewId: string;
  otherPartyClerkId: string;
  otherPartyLabel: string;
}) {
  const { onlineClerkIds } = useInterviewSocket(interviewId);
  const isOnline = onlineClerkIds.has(otherPartyClerkId);

  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span
        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`}
      />
      {otherPartyLabel} is {isOnline ? 'online' : 'offline'}
    </div>
  );
}
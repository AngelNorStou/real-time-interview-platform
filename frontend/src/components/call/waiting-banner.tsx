'use client';

import { useCallStateHooks } from '@stream-io/video-react-sdk';

export default function WaitingBanner() {
  const { useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();

  if (participantCount > 1) return null;

  return (
    <div className="mx-auto mb-3 w-fit rounded-full bg-amber-900/60 px-4 py-2 text-sm font-medium text-amber-200">
      Waiting for the other participant to join…
    </div>
  );
}
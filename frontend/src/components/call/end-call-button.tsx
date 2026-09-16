'use client';

import useStreamCall from '@/hooks/use-stream-call';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

export default function EndCallButton() {
  const call = useStreamCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const participantIsCallOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!participantIsCallOwner) return null;

  return (
    <button
      onClick={call.endCall}
      className="mx-auto block rounded-md bg-red-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      End interview for everyone
    </button>
  );
}
'use client';

import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useInitializeVideoClient } from '@/hooks/use-video-client';
import { useLoadCall } from '@/hooks/use-load-call';
import useStreamCall from '@/hooks/use-stream-call';
import { startInterview, completeInterview } from '@/lib/api';
import SetupUI from '@/components/call/setup-ui';
import FlexibleCallLayout from '@/components/call/flexible-call-layout';

export function RoomClient({
  interviewId,
  callId,
}: {
  interviewId: string;
  callId: string;
}) {
  const videoClient = useInitializeVideoClient(interviewId);

  if (!videoClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={32} />
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <CallGate callId={callId} interviewId={interviewId} />
    </StreamVideo>
  );
}

function CallGate({ callId, interviewId }: { callId: string; interviewId: string }) {
  const { call, callLoading } = useLoadCall(callId);

  if (callLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={32} />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="mx-auto mt-12 max-w-md rounded-2xl border border-red-700 bg-red-950/40 p-6 text-center">
        <p className="font-semibold text-red-300">Call not found.</p>
        <Link
          href={`/interviews/${interviewId}`}
          className="mt-3 inline-block text-sm text-cyan-300 hover:underline"
        >
          Back to interview details
        </Link>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <MeetingScreen interviewId={interviewId} />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen({ interviewId }: { interviewId: string }) {
  const call = useStreamCall();
  const { getToken } = useAuth();
  const [setupComplete, setSetupComplete] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const completedRef = useRef(false);

  const { useCallCallingState, useCallEndedAt } = useCallStateHooks();
  const callingState = useCallCallingState();
  const callEndedAt = useCallEndedAt();

  useEffect(() => {
    if (!callEndedAt || completedRef.current) return;
    completedRef.current = true;

    (async () => {
      try {
        const token = await getToken();
        await completeInterview(interviewId, token);
      } catch (err) {
        console.error('Failed to mark interview completed', err);
      }
    })();
  }, [callEndedAt, interviewId, getToken]);

  async function handleSetupComplete() {
    try {
      await call.join();
      setSetupComplete(true);

      const token = await getToken();
      startInterview(interviewId, token).catch((err) => {
        console.error('Failed to mark interview in progress', err);
      });
    } catch (error) {
      console.error('Failed to join call:', error);
      setJoinError('Failed to join the call. Please try again.');
    }
  }

  if (callEndedAt) {
    return <MeetingEndedScreen interviewId={interviewId} />;
  }

  if (!setupComplete) {
    return <SetupUI onSetupComplete={handleSetupComplete} error={joinError} />;
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={32} />
      </div>
    );
  }

  return <FlexibleCallLayout interviewId={interviewId} />;
}

function MeetingEndedScreen({ interviewId }: { interviewId: string }) {
  return (
    <div className="mx-auto mt-12 max-w-md space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-xl">
      <p className="text-lg font-semibold text-cyan-200">
        This interview has ended.
      </p>
      <Link
        href={`/interviews/${interviewId}`}
        className="inline-block rounded-full bg-cyan-600 px-5 py-2 font-medium text-white transition-colors hover:bg-cyan-500"
      >
        Back to interview details
      </Link>
    </div>
  );
}
'use client';

import { CallingState, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Loader2, WifiOff } from 'lucide-react';

export default function ConnectionOverlay() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState === CallingState.RECONNECTING || callingState === CallingState.MIGRATING) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-950/80 backdrop-blur">
        <Loader2 className="animate-spin text-cyan-300" size={32} />
        <p className="text-sm font-medium text-cyan-100">Reconnecting…</p>
      </div>
    );
  }

  if (callingState === CallingState.OFFLINE) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-950/80 backdrop-blur">
        <WifiOff className="text-red-400" size={32} />
        <p className="text-sm font-medium text-red-200">No internet connection</p>
        <p className="text-xs text-slate-400">We ll reconnect automatically once youre back online.</p>
      </div>
    );
  }

  if (callingState === CallingState.RECONNECTING_FAILED) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-950/80 backdrop-blur">
        <WifiOff className="text-red-400" size={32} />
        <p className="text-sm font-medium text-red-200">Couldnt reconnect</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Rejoin
        </button>
      </div>
    );
  }

  return null;
}
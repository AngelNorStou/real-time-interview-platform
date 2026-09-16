'use client';

import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export function useLoadCall(callId: string) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [callLoading, setCallLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    async function loadCall() {
      setCallLoading(true);
      const streamCall = client!.call('default', callId);

      try {
        await streamCall.get();
        if (!cancelled) setCall(streamCall);
      } catch (error) {
        console.error('Failed to load call', error);
        if (!cancelled) setCall(undefined);
      } finally {
        if (!cancelled) setCallLoading(false);
      }
    }

    loadCall();

    return () => {
      cancelled = true;
    };
  }, [client, callId]);

  return { call, callLoading };
}
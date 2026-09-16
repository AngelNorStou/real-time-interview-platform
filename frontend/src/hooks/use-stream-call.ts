'use client';

import { useCall } from '@stream-io/video-react-sdk';

export default function useStreamCall() {
  const call = useCall();
  if (!call) {
    throw new Error('useStreamCall must be used inside a StreamCall component');
  }
  return call;
}
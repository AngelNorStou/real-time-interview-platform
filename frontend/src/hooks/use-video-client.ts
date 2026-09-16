'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { getStreamToken } from '@/lib/api';

export function useInitializeVideoClient(interviewId: string) {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!userLoaded || !user?.id) return;

    const userId = user.id;
    const userName = user.fullName || user.username || user.id;
    const userImage = user.imageUrl;

    let cancelled = false;

    async function connect() {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
      if (!apiKey) throw new Error('Stream API key not set');

      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: userId,
          name: userName,
          image: userImage,
        },
        tokenProvider: async () => {
          const clerkToken = await getToken();
          const { token } = await getStreamToken(interviewId, clerkToken);
          return token;
        },
      });

      clientRef.current = client;

      if (!cancelled) {
        setVideoClient(client);
      }
    }

    connect();

    return () => {
      cancelled = true;
      clientRef.current?.disconnectUser();
      clientRef.current = null;
      setVideoClient(null);
    };
  }, [user?.id, user?.fullName, user?.username, user?.imageUrl, userLoaded, interviewId, getToken]);

  return videoClient;
}
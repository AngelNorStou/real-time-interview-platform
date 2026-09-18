'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { StreamChat, Channel } from 'stream-chat';
import { getChatToken } from '@/lib/api';

export function useInitializeChatClient(interviewId: string) {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const clientRef = useRef<StreamChat | null>(null);

  useEffect(() => {
    if (!userLoaded || !user?.id) return;

    const userId = user.id;
    const userName =
      user.fullName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      user.id;

    let cancelled = false;

    async function connect() {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
      if (!apiKey) throw new Error('Stream API key not set');

      const client = StreamChat.getInstance(apiKey);

      const clerkToken = await getToken();
      const { token, channelId, channelType } = await getChatToken(
        interviewId,
        clerkToken,
      );

      await client.connectUser({ id: userId, name: userName }, token);

      clientRef.current = client;

      const streamChannel = client.channel(channelType, channelId);
      await streamChannel.watch();

      if (!cancelled) {
        setChatClient(client);
        setChannel(streamChannel);
      }
    }

    connect();

    return () => {
      cancelled = true;
      clientRef.current?.disconnectUser();
      clientRef.current = null;
      setChatClient(null);
      setChannel(null);
    };
  }, [
    user?.id,
    user?.fullName,
    user?.username,
    user?.primaryEmailAddress?.emailAddress,
    userLoaded,
    interviewId,
    getToken,
  ]);

  return { chatClient, channel };
}
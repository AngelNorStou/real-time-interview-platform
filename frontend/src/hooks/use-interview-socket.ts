'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface PresenceUser {
  clerkId: string;
  name: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useInterviewSocket(interviewId: string) {
  const { getToken, isLoaded } = useAuth();
  const router = useRouter();
  const [onlineClerkIds, setOnlineClerkIds] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    async function connect() {
      const token = await getToken();
      if (!token || cancelled) {
        console.warn('[socket] no token available, skipping connection');
        return;
      }

      const socket = io(`${SOCKET_URL}/events`, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[socket] connected', socket.id);
        socket.emit('join-interview', { interviewId });
      });

      socket.on('connect_error', (err) => {
        console.error('[socket] connect_error', err.message);
      });

      socket.on('disconnect', (reason) => {
        console.log('[socket] disconnected', reason);
      });

      socket.on('presence', (users: PresenceUser[]) => {
        console.log('[socket] presence', users);
        setOnlineClerkIds(new Set(users.map((u) => u.clerkId)));
      });

      socket.on('user-joined', (user: PresenceUser) => {
        console.log('[socket] user-joined', user);
        setOnlineClerkIds((prev) => new Set(prev).add(user.clerkId));
      });

      socket.on('user-left', (user: PresenceUser) => {
        console.log('[socket] user-left', user);
        setOnlineClerkIds((prev) => {
          const next = new Set(prev);
          next.delete(user.clerkId);
          return next;
        });
      });

      socket.on('interview-started', () => {
        router.refresh();
      });

      socket.on('interview-ended', () => {
        router.refresh();
      });
    }

    connect();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [interviewId, getToken, isLoaded, router]);

  return { onlineClerkIds };
}
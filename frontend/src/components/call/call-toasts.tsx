'use client';

import { useEffect, useRef, useState } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

interface Toast {
  id: string;
  message: string;
}

export default function CallToasts() {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const knownIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    const currentIds = new Set(participants.map((p) => p.sessionId));

    // First run: just record who's here, don't announce the initial join.
    if (knownIdsRef.current === null) {
      knownIdsRef.current = currentIds;
      return;
    }

    const previousIds = knownIdsRef.current;
    const newToasts: Toast[] = [];

    for (const p of participants) {
      if (!previousIds.has(p.sessionId)) {
        newToasts.push({
          id: `${p.sessionId}-joined-${Date.now()}`,
          message: `${p.name || 'A participant'} joined`,
        });
      }
    }

    for (const id of previousIds) {
      if (!currentIds.has(id)) {
        const left = participants.find((p) => p.sessionId === id);
        newToasts.push({
          id: `${id}-left-${Date.now()}`,
          message: `${left?.name || 'A participant'} left`,
        });
      }
    }

    knownIdsRef.current = currentIds;

    if (newToasts.length === 0) return;

    const addTimeoutId = setTimeout(() => {
      setToasts((prev) => [...prev, ...newToasts]);

      newToasts.forEach((t) => {
        setTimeout(() => {
          setToasts((prev) => prev.filter((existing) => existing.id !== t.id));
        }, 4000);
      });
    }, 0);

    return () => clearTimeout(addTimeoutId);
  }, [participants]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg backdrop-blur"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
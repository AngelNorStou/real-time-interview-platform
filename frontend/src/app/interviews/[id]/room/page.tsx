import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getInterview, ApiError } from '@/lib/api';
import { RoomClient } from './room-client';

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  if (!userId)
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/interviews/${id}/room`)}`);

  const token = await getToken();

  let interview;
  try {
    interview = await getInterview(id, token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    if (err instanceof ApiError && err.status === 403) redirect('/unauthorized');
    throw err;
  }

  if (!interview.streamCallId) {
    redirect(`/interviews/${id}`);
  }

  return <RoomClient interviewId={interview.id} callId={interview.streamCallId} />;
}
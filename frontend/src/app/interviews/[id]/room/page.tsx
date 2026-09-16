import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getInterview } from '@/lib/api';
import { RoomClient } from './room-client'

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  if (!userId) redirect('/sign-in');

  const token = await getToken();

  let interview;
  try {
    interview = await getInterview(id, token);
  } catch {
    redirect('/dashboard');
  }

  if (!interview.streamCallId) {
    redirect(`/interviews/${id}`);
  }

  return <RoomClient interviewId={interview.id} callId={interview.streamCallId} />;
}
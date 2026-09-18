import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getMyFeedback } from '@/lib/api';
import { FeedbackHistoryClient } from './feedback-history-client';

export default async function FeedbackHistoryPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent('/feedback')}`);

  const token = await getToken();
  const feedback = await getMyFeedback(token);

  return <FeedbackHistoryClient feedback={feedback} />;
}
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Feedback, Recommendation, submitFeedback } from '@/lib/api';
import Button from '@/components/Button';

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  STRONG_HIRE: 'Strong hire',
  HIRE: 'Hire',
  NO_HIRE: 'No hire',
  STRONG_NO_HIRE: 'Strong no hire',
};

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-sky-400">{label}</label>
      <div className="mt-1 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 w-9 rounded-full text-sm font-semibold transition-colors ${
              value >= n
                ? 'bg-sky-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackSection({
  interviewId,
  existingFeedback,
}: {
  interviewId: string;
  existingFeedback: Feedback | null;
}) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState(existingFeedback?.rating ?? 0);
  const [technicalScore, setTechnicalScore] = useState(existingFeedback?.technicalScore ?? 0);
  const [communicationScore, setCommunicationScore] = useState(
    existingFeedback?.communicationScore ?? 0,
  );
  const [recommendation, setRecommendation] = useState<Recommendation | ''>(
    existingFeedback?.recommendation ?? '',
  );
  const [comments, setComments] = useState(existingFeedback?.comments ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating < 1) {
      setError('Please select an overall rating.');
      return;
    }

    startTransition(async () => {
      try {
        const token = await getToken();
        await submitFeedback(
          interviewId,
          {
            rating,
            technicalScore: technicalScore || undefined,
            communicationScore: communicationScore || undefined,
            recommendation: recommendation || undefined,
            comments: comments || undefined,
          },
          token,
        );
        setSuccess(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      }
    });
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400';

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-xl backdrop-blur">
      <h2 className="text-lg font-bold text-cyan-200">
        {existingFeedback ? 'Your feedback' : 'Leave feedback'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <RatingInput label="Overall rating" value={rating} onChange={setRating} />
        <RatingInput label="Technical" value={technicalScore} onChange={setTechnicalScore} />
        <RatingInput
          label="Communication"
          value={communicationScore}
          onChange={setCommunicationScore}
        />

        <div>
          <label className="block text-sm font-medium text-sky-400">Recommendation</label>
          <select
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value as Recommendation | '')}
            className={inputClass}
          >
            <option value="">— No recommendation —</option>
            {(Object.keys(RECOMMENDATION_LABELS) as Recommendation[]).map((key) => (
              <option key={key} value={key}>
                {RECOMMENDATION_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sky-400">Notes</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">Feedback saved.</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : existingFeedback ? 'Update feedback' : 'Submit feedback'}
        </Button>
      </form>
    </div>
  );
}
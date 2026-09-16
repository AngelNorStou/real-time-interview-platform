'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createInterview } from '@/lib/api';
import { getNow } from '@/lib/time';
import Button from '@/components/Button';

export function CreateInterviewModal({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(45);
  const [candidateEmail, setCandidateEmail] = useState('');

  const inputClass =
    'mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400';

    function toLocalDateTimeString(date: Date) {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    const minDateTimeLocal = toLocalDateTimeString(new Date(getNow() + 5 * 60 * 1000));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setError('Scheduled time must be in the future.');
      return;
    }

    if (duration < 1 || duration > 480) {
      setError('Duration must be between 1 and 480 minutes.');
      return;
    }

    startTransition(async () => {
      try {
        const token = await getToken();
        const interview = await createInterview(
          {
            title,
            description: description || undefined,
            scheduledAt: new Date(scheduledAt).toISOString(),
            duration,
            candidateEmail,
          },
          token,
        );
        router.push(`/interviews/${interview.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create interview');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">New interview</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-sky-400">Title</label>
            <input
              required
              minLength={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-400">
              Date & time
            </label>
            <input
              required
              type="datetime-local"
              min={minDateTimeLocal}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-400">
              Duration (minutes)
            </label>
            <input
              required
              type="number"
              min={1}
              max={480}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-400">
              Candidate email
            </label>
            <input
              required
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder="candidate@example.com"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-400">
              The candidate needs to have already signed up.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
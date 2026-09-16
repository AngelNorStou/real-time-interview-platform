'use client';

import { useState } from 'react';
import { Interview } from '@/lib/api';
import { InterviewCard } from '@/components/interviews/interview-card';
import { CreateInterviewModal } from '@/components/interviews/create-interview-modal';
import Button from '@/components/Button';

export function DashboardClient({
  interviews,
  currentClerkId,
  now,
}: {
  interviews: Interview[];
  currentClerkId: string;
  now: number;
}) {
  const [showCreate, setShowCreate] = useState(false);

  const upcoming = interviews
    .filter(
      (i) => new Date(i.scheduledAt).getTime() > now && i.status !== 'CANCELLED',
    )
    .sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

  const past = interviews
    .filter(
      (i) => new Date(i.scheduledAt).getTime() <= now || i.status === 'CANCELLED',
    )
    .sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-cyan-200">Interviews</h1>
        <Button onClick={() => setShowCreate(true)}>Create interview</Button>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400">No upcoming interviews.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((i) => (
              <InterviewCard key={i.id} interview={i} currentClerkId={currentClerkId} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">
          Past
        </h2>
        {past.length === 0 ? (
          <p className="text-sm text-slate-400">No past interviews.</p>
        ) : (
          <div className="space-y-3">
            {past.map((i) => (
              <InterviewCard key={i.id} interview={i} currentClerkId={currentClerkId} />
            ))}
          </div>
        )}
      </section>

      {showCreate && <CreateInterviewModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
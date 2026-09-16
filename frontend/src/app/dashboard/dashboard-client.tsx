'use client';

import { useMemo, useState } from 'react';
import { Interview } from '@/lib/api';
import { InterviewCard } from '@/components/interviews/interview-card';
import { CreateInterviewModal } from '@/components/interviews/create-interview-modal';
import Button from '@/components/Button';

const PAGE_SIZE = 8;

type SectionKey = 'current' | 'upcoming' | 'past';

const SECTION_LABELS: Record<SectionKey, string> = {
  current: 'Current',
  upcoming: 'Upcoming',
  past: 'Past',
};

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
  const [activeSection, setActiveSection] = useState<SectionKey>('upcoming');
  const [page, setPage] = useState(1);

  const sections = useMemo(() => {
    const current = interviews
      .filter((i) => i.status === 'IN_PROGRESS')
      .sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );

    const upcoming = interviews
      .filter((i) => i.status === 'SCHEDULED' && new Date(i.scheduledAt).getTime() > now)
      .sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );

    const past = interviews
      .filter(
        (i) =>
          i.status === 'COMPLETED' ||
          i.status === 'CANCELLED' ||
          (i.status === 'SCHEDULED' && new Date(i.scheduledAt).getTime() <= now),
      )
      .sort(
        (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );

    return { current, upcoming, past };
  }, [interviews, now]);

  const activeList = sections[activeSection];
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const pagedList = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSectionChange(section: SectionKey) {
    setActiveSection(section);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-cyan-200">Interviews</h1>
        <Button onClick={() => setShowCreate(true)}>Create interview</Button>
      </div>

      <div className="mt-6 flex gap-2">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleSectionChange(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeSection === key
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {SECTION_LABELS[key]} ({sections[key].length})
          </button>
        ))}
      </div>

      <section className="mt-6">
        {pagedList.length === 0 ? (
          <p className="text-sm text-slate-400">
            No {SECTION_LABELS[activeSection].toLowerCase()} interviews.
          </p>
        ) : (
          <div className="space-y-3">
            {pagedList.map((i) => (
              <InterviewCard
                key={i.id}
                interview={i}
                currentClerkId={currentClerkId}
                now={now}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {showCreate && <CreateInterviewModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
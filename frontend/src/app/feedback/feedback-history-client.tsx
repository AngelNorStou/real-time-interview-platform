'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FeedbackWithInterview } from '@/lib/api';

export function FeedbackHistoryClient({
  feedback,
}: {
  feedback: FeedbackWithInterview[];
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return feedback;

    return feedback.filter((f) => {
      const candidate = f.Interview.candidate;
      const name = candidate.name?.toLowerCase() ?? '';
      const email = candidate.email.toLowerCase();
      const title = f.Interview.title.toLowerCase();
      return name.includes(q) || email.includes(q) || title.includes(q);
    });
  }, [feedback, query]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-cyan-200">Feedback history</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by candidate name, email, or interview title"
        className="mt-4 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
      />

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400">No feedback found.</p>
        ) : (
          filtered.map((f) => (
            <Link
              key={f.id}
              href={`/interviews/${f.Interview.id}`}
              className="block rounded-2xl border border-slate-700 bg-slate-800/60 p-4 shadow-xl backdrop-blur transition-colors hover:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-cyan-100">{f.Interview.title}</h3>
                  <p className="text-sm text-sky-300/80">
                    Candidate: {f.Interview.candidate.name ?? f.Interview.candidate.email}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-200">{f.rating}/5</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(f.Interview.scheduledAt).toLocaleDateString()}
              </p>
              {f.comments && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">{f.comments}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
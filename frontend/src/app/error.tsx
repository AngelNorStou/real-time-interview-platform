'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-800 bg-red-950/30 p-8 text-center">
      <h1 className="text-lg font-semibold text-red-200">Something went wrong</h1>
      <p className="text-sm text-red-300/80">
        An unexpected error occurred. You can try again, or head back to the dashboard.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
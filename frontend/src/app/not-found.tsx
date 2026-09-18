import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-center">
      <h1 className="text-lg font-semibold text-cyan-200">Page not found</h1>
      <p className="text-sm text-slate-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
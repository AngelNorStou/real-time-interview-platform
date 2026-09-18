import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-amber-800 bg-amber-950/30 p-8 text-center">
      <h1 className="text-lg font-semibold text-amber-200">Access denied</h1>
      <p className="text-sm text-amber-300/80">
        You do not have permission to view this. If you think this is a mistake,
        double-check you are signed in with the right account.
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
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-cyan-100 sm:text-5xl">
        Real-time interviews, without the hassle
      </h1>
      <p className="max-w-xl text-slate-300">
        Schedule interviews, meet candidates over video, and capture structured
        feedback — all in one place.
      </p>

      <div className="mt-4 flex gap-3">
        {userId ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Get started
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:bg-slate-700"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
import Link from 'next/link';

export default async function LeftInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-xl">
      <p className="text-lg font-semibold text-cyan-200">
        You left the interview.
      </p>
      <div className="flex gap-3">
        <Link
          href={`/interviews/${id}/room`}
          className="rounded-full bg-cyan-600 px-5 py-2 font-medium text-white transition-colors hover:bg-cyan-500"
        >
          Rejoin
        </Link>
        <Link
          href={`/interviews/${id}`}
          className="rounded-full border border-slate-600 px-5 py-2 font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          Interview details
        </Link>
      </div>
    </div>
  );
}
import { InterviewStatus } from '@/lib/api';

const STYLES: Record<InterviewStatus, string> = {
  DRAFT: 'bg-slate-600 text-slate-100',
  SCHEDULED: 'bg-sky-600 text-white',
  READY: 'bg-indigo-600 text-white',
  IN_PROGRESS: 'bg-emerald-600 text-white',
  COMPLETED: 'bg-slate-500 text-white',
  CANCELLED: 'bg-red-600 text-white',
};

const LABELS: Record<InterviewStatus, string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  READY: 'Ready',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export function StatusBadge({ status }: { status: InterviewStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
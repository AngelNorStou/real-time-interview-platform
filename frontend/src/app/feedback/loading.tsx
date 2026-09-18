import { Loader2 } from 'lucide-react';

export default function FeedbackLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-cyan-300" size={32} />
    </div>
  );
}
import { Mic, Webcam } from 'lucide-react';

export default function PermissionPrompt() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
      <div className="flex items-center gap-6 text-sky-400">
        <Webcam size={48} />
        <Mic size={48} />
      </div>
      <p className="text-center text-base font-medium text-sky-200">
        Please allow access to your microphone and camera to join the interview
      </p>
    </div>
  );
}
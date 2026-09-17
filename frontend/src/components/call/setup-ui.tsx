'use client';

import {
  DeviceSettings,
  VideoPreview,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import useStreamCall from '@/hooks/use-stream-call';
import AudioVolumeIndicator from './audio-volume-indicator';
import PermissionPrompt from './permission-prompt';
import Button from '@/components/Button';

interface SetupUIProps {
  onSetupComplete: () => void;
  error?: string | null;
}

export default function SetupUI({ onSetupComplete, error }: SetupUIProps) {
  const call = useStreamCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const camState = useCameraState();

  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border border-slate-700 bg-slate-800/60 p-8 shadow-xl backdrop-blur">
      <h1 className="text-center text-2xl font-bold text-cyan-200">
        Ready to join?
      </h1>

      <div className="w-full overflow-hidden rounded-xl">
        <VideoPreview />
      </div>

      <div className="flex h-12 w-full items-center justify-center gap-4">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => call.camera.toggle()}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            camState.isEnabled
              ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {camState.isEnabled ? <Video size={16} /> : <VideoOff size={16} />}
          Camera {camState.isEnabled ? 'on' : 'off'}
        </button>

        <button
          type="button"
          onClick={() => call.microphone.toggle()}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            micState.isEnabled
              ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {micState.isEnabled ? <Mic size={16} /> : <MicOff size={16} />}
          Mic {micState.isEnabled ? 'on' : 'off'}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button onClick={onSetupComplete}>Join interview</Button>
    </div>
  );
}
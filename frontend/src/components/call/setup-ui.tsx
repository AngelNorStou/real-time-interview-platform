'use client';

import {
  DeviceSettings,
  VideoPreview,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
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
  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    if (micCamDisabled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [micCamDisabled, call]);

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

      <label className="flex items-center gap-2 font-medium text-sky-300">
        <input
          type="checkbox"
          className="h-4 w-4 accent-sky-500"
          checked={micCamDisabled}
          onChange={(e) => setMicCamDisabled(e.target.checked)}
        />
        Join with mic and camera off
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button onClick={onSetupComplete}>Join interview</Button>
    </div>
  );
}
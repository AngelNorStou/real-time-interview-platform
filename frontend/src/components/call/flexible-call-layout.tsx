'use client';

import useStreamCall from '@/hooks/use-stream-call';
import {
  CallControls,
  PaginatedGridLayout,
  SpeakerLayout,
} from '@stream-io/video-react-sdk';
import {
  BetweenHorizonalEnd,
  BetweenVerticalEnd,
  LayoutGrid,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EndCallButton from './end-call-button';
import CallToasts from './call-toasts';
import WaitingBanner from './waiting-banner';
import ConnectionOverlay from './connection-overlay';

type CallLayoutType = 'speaker-vert' | 'speaker-horiz' | 'grid';

export default function FlexibleCallLayout({
  interviewId,
}: {
  interviewId: string;
}) {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-vert');
  const router = useRouter();

  return (
    <div className="space-y-3 p-4">
      <ConnectionOverlay />
      <CallToasts />
      <WaitingBanner />
      <CallLayoutButtons layout={layout} setLayout={setLayout} />
      <CallLayoutView layout={layout} />
      <CallControls
        onLeave={() => router.push(`/interviews/${interviewId}/left`)}
      />
      <EndCallButton />
    </div>
  );
}

function CallLayoutButtons({
  layout,
  setLayout,
}: {
  layout: CallLayoutType;
  setLayout: (layout: CallLayoutType) => void;
}) {
  return (
    <div className="mx-auto w-fit space-x-6 text-sky-300">
      <button onClick={() => setLayout('speaker-vert')}>
        <BetweenVerticalEnd
          className={layout !== 'speaker-vert' ? 'text-slate-500' : ''}
        />
      </button>
      <button onClick={() => setLayout('speaker-horiz')}>
        <BetweenHorizonalEnd
          className={layout !== 'speaker-horiz' ? 'text-slate-500' : ''}
        />
      </button>
      <button onClick={() => setLayout('grid')}>
        <LayoutGrid className={layout !== 'grid' ? 'text-slate-500' : ''} />
      </button>
    </div>
  );
}

function CallLayoutView({ layout }: { layout: CallLayoutType }) {
  if (layout === 'speaker-vert') return <SpeakerLayout />;
  if (layout === 'speaker-horiz')
    return <SpeakerLayout participantsBarPosition="right" />;
  if (layout === 'grid') return <PaginatedGridLayout />;
  return null;
}
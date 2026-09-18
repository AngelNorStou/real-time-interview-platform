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
  MessageCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EndCallButton from './end-call-button';
import CallToasts from './call-toasts';
import WaitingBanner from './waiting-banner';
import ConnectionOverlay from './connection-overlay';
import ChatPanel from './chat-panel';

type CallLayoutType = 'speaker-vert' | 'speaker-horiz' | 'grid';

export default function FlexibleCallLayout({
  interviewId,
}: {
  interviewId: string;
}) {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-vert');
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-3 p-4">
      <ConnectionOverlay />
      <CallToasts />
      <WaitingBanner />

      <div className="mx-auto flex w-fit items-center gap-6">
        <CallLayoutButtons layout={layout} setLayout={setLayout} />
        <button
          onClick={() => setShowChat((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            showChat ? 'bg-sky-600 text-white' : 'text-sky-300 hover:bg-slate-700'
          }`}
        >
          <MessageCircle size={16} />
          Chat
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <CallLayoutView layout={layout} />
        </div>
        <div className="flex h-[70vh] flex-col gap-3 md:h-[500px] md:flex-row">
        {showChat && (
          <div className="h-96 w-full md:h-auto md:w-80">
            <ChatPanel interviewId={interviewId} />
          </div>
        )}
        </div>
      </div>

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
    <div className="flex items-center gap-6 text-sky-300">
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
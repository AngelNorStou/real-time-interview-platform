'use client';

import {
  Chat,
  Channel as ChannelComponent,
  MessageList,
  MessageComposer,
} from 'stream-chat-react';
import { Loader2 } from 'lucide-react';
import { useInitializeChatClient } from '@/hooks/use-chat-client';
import 'stream-chat-react/dist/css/index.css';

export default function ChatPanel({ interviewId }: { interviewId: string }) {
  const { chatClient, channel } = useInitializeChatClient(interviewId);

  if (!chatClient || !channel) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
        <Loader2 className="animate-spin text-cyan-300" size={24} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white">
      <Chat client={chatClient} theme="messaging dark">
        <ChannelComponent channel={channel}>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <MessageList />
            </div>
            <div className="border-t border-slate-700 p-2">
              <MessageComposer />
            </div>
          </div>
        </ChannelComponent>
      </Chat>
    </div>
  );
}
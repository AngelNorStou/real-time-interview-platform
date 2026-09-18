import { Injectable } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class ChatService {
  private client: StreamChat;

  constructor() {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('STREAM_API_KEY or STREAM_API_SECRET not set');
    }

    this.client = StreamChat.getInstance(apiKey, apiSecret);
  }

  async upsertUsers(users: { id: string; name?: string | null }[]) {
    await this.client.upsertUsers(
      users.map((u) => ({
        id: u.id,
        name: u.name ?? u.id,
      })),
    );
  }

  generateUserToken(clerkUserId: string): string {
    return this.client.createToken(clerkUserId);
  }

  async getOrCreateChannel(params: {
    channelId: string;
    createdByUserId: string;
    memberUserIds: string[];
  }) {
    const channel = this.client.channel('messaging', params.channelId, {
      members: params.memberUserIds,
      created_by_id: params.createdByUserId,
    });

    await channel.create();

    return channel;
  }
}
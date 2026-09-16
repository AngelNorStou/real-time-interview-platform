import { Injectable } from '@nestjs/common';
import { StreamClient } from '@stream-io/node-sdk';

@Injectable()
export class StreamService {
  private client: StreamClient;

  constructor() {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('STREAM_API_KEY or STREAM_API_SECRET not set');
    }

    this.client = new StreamClient(apiKey, apiSecret);
  }

  async upsertUsers(users: { id: string; name?: string | null }[]) {
    await this.client.upsertUsers(
      users.map((u) => ({
        id: u.id,
        name: u.name ?? u.id,
        role: 'user',
      })),
    );
  }

  generateUserToken(clerkUserId: string): string {
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1h
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    return this.client.createToken(clerkUserId, expirationTime, issuedAt);
  }

  async getOrCreateCall(params: {
    callId: string;
    createdByUserId: string;
    memberUserIds: string[];
  }) {
    const call = this.client.video.call('default', params.callId);

    await call.getOrCreate({
      data: {
        created_by_id: params.createdByUserId,
        members: params.memberUserIds.map((id) => ({ user_id: id })),
      },
    });

    return call;
  }
}
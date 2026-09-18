import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

interface PresenceUser {
  clerkId: string;
  name: string;
}

@WebSocketGateway({
  namespace: '/events',
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // interviewId -> socketId -> PresenceUser
  private presence = new Map<string, Map<string, PresenceUser>>();

  constructor(private prisma: PrismaService) {}

  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth?.token as string | undefined;
        if (!token) throw new Error('No token provided');

        const secretKey = process.env.CLERK_SECRET_KEY;
        if (!secretKey) throw new Error('CLERK_SECRET_KEY not set');

        const verified = await verifyToken(token, { secretKey });
        const clerkId = verified.sub;

        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new Error('User not found for clerkId');

        socket.data.user = user;
        next();
      } catch (error) {
        console.error('[gateway] auth failed:', (error as Error).message);
        next(error as Error);
      }
    });
  }

  handleDisconnect(client: Socket) {
    const interviewId = client.data.interviewId as string | undefined;
    if (!interviewId) return;

    const room = this.presence.get(interviewId);
    if (!room) return;

    const leaving = room.get(client.id);
    room.delete(client.id);

    if (leaving) {
      this.server.to(`interview:${interviewId}`).emit('user-left', leaving);
    }

    if (room.size === 0) {
      this.presence.delete(interviewId);
    }
  }

  @SubscribeMessage('join-interview')
  async handleJoinInterview(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { interviewId: string },
  ) {
    const user = client.data.user;
    console.log('[gateway] join-interview received', {
      socketId: client.id,
      hasUser: !!user,
      interviewId: data?.interviewId,
    });

    if (!user) {
      console.warn('[gateway] join-interview rejected: no authenticated user on socket');
      return;
    }

    const interview = await this.prisma.interview.findUnique({
      where: { id: data.interviewId },
    });

    const isParticipant =
      interview &&
      (interview.candidateId === user.id || interview.interviewerId === user.id);

    if (!isParticipant) {
      console.warn('[gateway] join-interview rejected: not a participant', {
        userId: user.id,
        interviewId: data.interviewId,
        found: !!interview,
      });
      return;
    }

    const room = `interview:${data.interviewId}`;
    client.join(room);
    client.data.interviewId = data.interviewId;

    const presenceUser: PresenceUser = {
      clerkId: user.clerkId,
      name: user.name ?? user.email,
    };

    if (!this.presence.has(data.interviewId)) {
      this.presence.set(data.interviewId, new Map());
    }
    const roomPresence = this.presence.get(data.interviewId)!;
    roomPresence.set(client.id, presenceUser);

    console.log('[gateway] sending presence to', client.id, Array.from(roomPresence.values()));
    client.emit('presence', Array.from(roomPresence.values()));
    client.to(room).emit('user-joined', presenceUser);
  }

  emitInterviewStarted(interviewId: string) {
    this.server.to(`interview:${interviewId}`).emit('interview-started', { interviewId });
  }

  emitInterviewEnded(interviewId: string) {
    this.server.to(`interview:${interviewId}`).emit('interview-ended', { interviewId });
  }
}
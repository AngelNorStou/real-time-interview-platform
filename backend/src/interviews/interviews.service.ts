import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreamService } from '../stream/stream.service';
import { EventsGateway } from '../events/events.gateway';
import { ChatService } from '../chat/chat.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewStatus, User } from '../generated/prisma/client';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    private streamService: StreamService,
    private eventsGateway: EventsGateway,
    private chatService: ChatService,
  ) {}

  async create(dto: CreateInterviewDto, interviewer: User) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: { equals: dto.candidateEmail, mode: 'insensitive' } },
    });

    if (!candidate) {
      throw new NotFoundException(
        `No user found with email ${dto.candidateEmail}. They need to sign up first.`,
      );
    }

    const interview = await this.prisma.interview.create({
      data: {
        title: dto.title,
        description: dto.description,
        scheduledAt: new Date(dto.scheduledAt),
        duration: dto.duration,
        candidateId: candidate.id,
        interviewerId: interviewer.id,
      },
      include: { candidate: true, interviewer: true },
    });

    await this.streamService.upsertUsers([
      { id: interviewer.clerkId, name: interviewer.name ?? interviewer.email },
      { id: candidate.clerkId, name: candidate.name ?? candidate.email },
    ]);

    await this.streamService.getOrCreateCall({
      callId: interview.id,
      createdByUserId: interviewer.clerkId,
      memberUserIds: [interviewer.clerkId, candidate.clerkId],
    });

    await this.chatService.upsertUsers([
      { id: interviewer.clerkId, name: interviewer.name ?? interviewer.email },
      { id: candidate.clerkId, name: candidate.name ?? candidate.email },
    ]);

    await this.chatService.getOrCreateChannel({
      channelId: interview.id,
      createdByUserId: interviewer.clerkId,
      memberUserIds: [interviewer.clerkId, candidate.clerkId],
    });

    return this.prisma.interview.update({
      where: { id: interview.id },
      data: { streamCallId: interview.id },
      include: { candidate: true, interviewer: true },
    });
  }

  async findById(id: string, requester: User) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: { candidate: true, interviewer: true },
    });

    if (!interview) throw new NotFoundException('Interview not found');
    this.assertParticipant(interview, requester);

    return interview;
  }

  async findMine(user: User) {
    return this.prisma.interview.findMany({
      where: {
        OR: [{ candidateId: user.id }, { interviewerId: user.id }],
      },
      include: { candidate: true, interviewer: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async update(id: string, dto: UpdateInterviewDto, requester: User) {
    const interview = await this.findById(id, requester);
    this.assertInterviewerOrAdmin(interview, requester);

    return this.prisma.interview.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async cancel(id: string, requester: User) {
    const interview = await this.findById(id, requester);
    this.assertParticipant(interview, requester);

    return this.prisma.interview.update({
      where: { id },
      data: { status: InterviewStatus.CANCELLED },
    });
  }

  async start(id: string, requester: User) {
    const interview = await this.findById(id, requester);

    if (interview.status !== InterviewStatus.SCHEDULED) {
      return interview;
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: InterviewStatus.IN_PROGRESS },
    });

    this.eventsGateway.emitInterviewStarted(id);

    return updated;
  }

  async complete(id: string, requester: User) {
    const interview = await this.findById(id, requester);

    if (
      interview.status === InterviewStatus.CANCELLED ||
      interview.status === InterviewStatus.COMPLETED
    ) {
      return interview;
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: InterviewStatus.COMPLETED },
    });

    this.eventsGateway.emitInterviewEnded(id);

    return updated;
  }

  async remove(id: string, requester: User) {
    const interview = await this.findById(id, requester);
    this.assertInterviewerOrAdmin(interview, requester);

    await this.prisma.interview.delete({ where: { id } });
    return { id };
  }

  async getStreamToken(id: string, requester: User) {
    const interview = await this.findById(id, requester);

    if (!interview.streamCallId) {
      throw new NotFoundException('No Stream call associated with this interview');
    }

    await this.streamService.upsertUsers([
      { id: requester.clerkId, name: requester.name ?? requester.email },
    ]);

    const token = this.streamService.generateUserToken(requester.clerkId);

    return {
      token,
      callId: interview.streamCallId,
      callType: 'default',
    };
  }

  async getChatToken(id: string, requester: User) {
    const interview = await this.findById(id, requester);

    await this.chatService.upsertUsers([
      { id: requester.clerkId, name: requester.name ?? requester.email },
    ]);

    const token = this.chatService.generateUserToken(requester.clerkId);

    return {
      token,
      channelId: interview.id,
      channelType: 'messaging',
    };
  }

  private assertParticipant(
    interview: { candidateId: string; interviewerId: string },
    user: User,
  ) {
    const isParticipant =
      interview.candidateId === user.id || interview.interviewerId === user.id;
    if (!isParticipant && user.role !== 'ADMIN') {
      throw new ForbiddenException('Not a participant in this interview');
    }
  }

  private assertInterviewerOrAdmin(
    interview: { interviewerId: string },
    user: User,
  ) {
    if (interview.interviewerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the interviewer or an admin can do this');
    }
  }
}
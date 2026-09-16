import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import type { User } from '../generated/prisma/client';
import { InterviewStatus } from '../generated/prisma/client';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInterviewDto, interviewer: User) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: { equals: dto.candidateEmail, mode: 'insensitive'}},
    });

    if (!candidate) {
      throw new NotFoundException(
        `No user found with email ${dto.candidateEmail}. They need to sign up first.`,
      );
    }

    if (candidate.role !== 'CANDIDATE') {
      throw new BadRequestException(
        `${dto.candidateEmail} is not registered as a candidate.`,
      );
    }
      return this.prisma.interview.create({
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

  async remove(id: string, requester: User) {
    const interview = await this.findById(id, requester);
    this.assertInterviewerOrAdmin(interview, requester);

    await this.prisma.interview.delete({ where: { id } });
    return { id };
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
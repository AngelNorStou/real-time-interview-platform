import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInterviewDto } from './dto/create-interview.dto.js';
import { UpdateInterviewDto } from './dto/update-interview.dto.js';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async create(interviewerId: string, dto: CreateInterviewDto) {
    return this.prisma.interview.create({
      data: {
        title: dto.title,
        description: dto.description,
        scheduledAt: new Date(dto.scheduledAt),
        duration: dto.duration,
        interviewerId,
        candidateId: dto.candidateId,
      },
    });
  }

  async findById(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: { interviewer: true, candidate: true },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  async findForUser(userId: string) {
    return this.prisma.interview.findMany({
      where: {
        OR: [{ interviewerId: userId }, { candidateId: userId }],
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async update(id: string, requesterId: string, dto: UpdateInterviewDto) {
    const interview = await this.findById(id);
    if (interview.interviewerId !== requesterId) {
      throw new ForbiddenException('Only the assigned interviewer can update this interview');
    }

    return this.prisma.interview.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async cancel(id: string, requesterId: string) {
    const interview = await this.findById(id);
    if (interview.interviewerId !== requesterId) {
      throw new ForbiddenException('Only the assigned interviewer can cancel this interview');
    }

    return this.prisma.interview.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async delete(id: string, requesterId: string) {
    const interview = await this.findById(id);
    if (interview.interviewerId !== requesterId) {
      throw new ForbiddenException('Only the assigned interviewer can delete this interview');
    }

    return this.prisma.interview.delete({ where: { id } });
  }

  async setStreamCallId(id: string, streamCallId: string) {
    return this.prisma.interview.update({
      where: { id },
      data: { streamCallId },
    });
  }
}
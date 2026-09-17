import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { InterviewStatus, User } from '../generated/prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async submit(interviewId: string, dto: SubmitFeedbackDto, author: User) {
    const interview = await this.getInterviewForAuthor(interviewId, author);

    if (
      interview.status !== InterviewStatus.IN_PROGRESS &&
      interview.status !== InterviewStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Feedback can only be submitted once the interview has started.',
      );
    }

    const existing = await this.prisma.feedback.findFirst({
      where: { interviewId, authorId: author.id },
    });

    const data = {
      rating: dto.rating,
      technicalScore: dto.technicalScore,
      communicationScore: dto.communicationScore,
      recommendation: dto.recommendation,
      comments: dto.comments,
    };

    if (existing) {
      return this.prisma.feedback.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.feedback.create({
      data: {
        ...data,
        interviewId,
        authorId: author.id,
      },
    });
  }

  async getForInterview(interviewId: string, requester: User) {
    await this.getInterviewForAuthor(interviewId, requester);

    return this.prisma.feedback.findFirst({
      where: { interviewId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getInterviewForAuthor(interviewId: string, user: User) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) throw new NotFoundException('Interview not found');

    const isInterviewer = interview.interviewerId === user.id;
    if (!isInterviewer && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only the interviewer or an admin can access feedback for this interview.',
      );
    }

    return interview;
  }
}
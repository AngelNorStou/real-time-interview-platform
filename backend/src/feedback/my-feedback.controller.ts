import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { FeedbackService } from './feedback.service';
import type { User } from '../generated/prisma/client';

@UseGuards(ClerkAuthGuard, RolesGuard)
@Controller('feedback')
export class MyFeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('me')
  findMine(@CurrentUser() user: User) {
    return this.feedbackService.findAllByAuthor(user);
  }
}
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { FeedbackService } from './feedback.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import type { User } from '../generated/prisma/client';

@UseGuards(ClerkAuthGuard, RolesGuard)
@Controller('interviews')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':id/feedback')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitFeedbackDto,
    @CurrentUser() user: User,
  ) {
    return this.feedbackService.submit(id, dto, user);
  }

  @Get(':id/feedback')
  get(@Param('id') id: string, @CurrentUser() user: User) {
    return this.feedbackService.getForInterview(id, user);
  }
}
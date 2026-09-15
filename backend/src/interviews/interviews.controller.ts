import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { InterviewsService } from './interviews.service.js';
import { CreateInterviewDto } from './dto/create-interview.dto.js';
import { UpdateInterviewDto } from './dto/update-interview.dto.js';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('INTERVIEWER', 'ADMIN')
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateInterviewDto,
  ) {
    return this.interviewsService.create(user.userId, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: { userId: string }) {
    return this.interviewsService.findForUser(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('INTERVIEWER', 'ADMIN')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(id, user.userId, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('INTERVIEWER', 'ADMIN')
  cancel(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.interviewsService.cancel(id, user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('INTERVIEWER', 'ADMIN')
  remove(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.interviewsService.delete(id, user.userId);
  }
}
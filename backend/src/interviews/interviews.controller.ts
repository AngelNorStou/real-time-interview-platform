import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import type { User } from '../generated/prisma/client';

@UseGuards(ClerkAuthGuard, RolesGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @Roles('INTERVIEWER', 'ADMIN')
  create(@Body() dto: CreateInterviewDto, @CurrentUser() user: User) {
    return this.interviewsService.create(dto, user);
  }

  @Get('me')
  findMine(@CurrentUser() user: User) {
    return this.interviewsService.findMine(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.findById(id, user);
  }

  @Get(':id/stream-token')
  getStreamToken(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.getStreamToken(id, user);
  }

  @Patch(':id')
  @Roles('INTERVIEWER', 'ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewDto,
    @CurrentUser() user: User,
  ) {
    return this.interviewsService.update(id, dto, user);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.cancel(id, user);
  }

  @Delete(':id')
  @Roles('INTERVIEWER', 'ADMIN')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.remove(id, user);
  }
  
  @Patch(':id/start')
  start(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.start(id, user);
  } 

  @Patch(':id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.interviewsService.complete(id, user);
  }  
}
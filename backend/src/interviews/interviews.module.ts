import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller.js';
import { InterviewsService } from './interviews.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js'; // ← add this

@Module({
  imports: [PrismaModule, AuthModule], // ← add AuthModule
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
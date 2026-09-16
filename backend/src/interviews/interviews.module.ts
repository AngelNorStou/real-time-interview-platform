import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamModule } from '../stream/stream.module';

@Module({
  imports: [PrismaModule, StreamModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
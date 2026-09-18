import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamModule } from '../stream/stream.module';
import { EventsModule } from '../events/events.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [PrismaModule, StreamModule, EventsModule, ChatModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
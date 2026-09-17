import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { InterviewsModule } from './interviews/interviews.module';
import { FeedbackModule } from './feedback/feedback.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InterviewsModule,
    FeedbackModule,

  ],
  controllers: [HealthController],
})
export class AppModule {}
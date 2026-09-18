import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { InterviewsModule } from './interviews/interviews.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InterviewsModule,
    FeedbackModule,
    WebhooksModule,

  ],
  controllers: [HealthController],
})
export class AppModule {}
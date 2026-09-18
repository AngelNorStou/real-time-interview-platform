import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('clerk')
  async handleClerkWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) throw new Error('CLERK_WEBHOOK_SECRET not set');

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const wh = new Webhook(secret);
    let event: { type: string; data: any };

    try {
      event = wh.verify(req.rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as unknown as { type: string; data: any };
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return this.webhooksService.handleClerkEvent(svixId, event);
  }
}
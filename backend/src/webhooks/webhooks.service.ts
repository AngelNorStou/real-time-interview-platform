import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ClerkEventData {
  id: string;
  email_addresses?: { id: string; email_address: string }[];
  primary_email_address_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
}

interface ClerkEvent {
  type: string;
  data: ClerkEventData;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleClerkEvent(eventId: string, event: ClerkEvent) {
    const alreadyProcessed = await this.prisma.processedEvent.findUnique({
      where: { eventId },
    });

    if (alreadyProcessed) {
      this.logger.log(`Skipping already-processed event ${eventId}`);
      return { received: true, skipped: true };
    }

    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await this.syncUser(event.data);
        break;
      case 'user.deleted':
        this.logger.log(
          `Received user.deleted for ${event.data.id} — no action taken (see note on deletions)`,
        );
        break;
      default:
        this.logger.log(`Unhandled Clerk event type: ${event.type}`);
    }

    try {
      await this.prisma.processedEvent.create({
        data: { eventId, eventType: event.type },
      });
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        this.logger.warn(`Race detected: event ${eventId} was already recorded`);
      } else {
        throw err;
      }
    }

    return { received: true };
  }

  private async syncUser(data: ClerkEventData) {
    const clerkId = data.id;
    const primaryEmail =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ?? data.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      this.logger.warn(`No email found for Clerk user ${clerkId}, skipping sync`);
      return;
    }

    const name =
      [data.first_name, data.last_name].filter(Boolean).join(' ') ||
      data.username ||
      null;

    await this.prisma.user.upsert({
      where: { clerkId },
      update: { email: primaryEmail, name },
      create: { clerkId, email: primaryEmail, name },
    });
  }
}
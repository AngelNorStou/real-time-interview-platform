import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      let user = await this.prisma.user.findUnique({
        where: { clerkId: payload.sub },
      });

      if (!user) {
        // First time we've seen this Clerk user — create the row now
        const clerkUser = await clerkClient.users.getUser(payload.sub);
        user = await this.prisma.user.create({
          data: {
            clerkId: payload.sub,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
          },
        });
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
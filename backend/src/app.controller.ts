import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return (req as any).user;
  } 
}

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from '../conversations/conversations.service';

@Controller('user')
export class HistoryController {
  constructor(private readonly convService: ConversationsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string, @Request() req: any) {
    if (req.user.userId !== userId) return { error: 'forbidden' };
    const recent = await this.convService.getRecent(userId, 100);
    return { history: recent };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string, @Request() req: any) {
    if (req.user.userId !== userId) return { error: 'forbidden' };
    const summary = await this.convService.getSummary(userId);
    return { summary };
  }
}

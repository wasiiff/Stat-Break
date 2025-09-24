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
    // Normalize user id from token (support sub or userId)
    const requesterId = req.user?.userId ?? req.user?.sub;

    // If client accidentally sends the string 'undefined' or nothing, fall back to requester
    const targetUserId = !userId || userId === 'undefined' ? requesterId : userId;

    if (!requesterId) return { error: 'unauthenticated' };
    if (requesterId !== targetUserId) return { error: 'forbidden' };

    const conversations = await this.convService.getRecent(targetUserId, 20);
    return { conversations };
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string, @Request() req: any) {
    const requesterId = req.user?.userId ?? req.user?.sub;
    const targetUserId = !userId || userId === 'undefined' ? requesterId : userId;

    if (!requesterId) return { error: 'unauthenticated' };
    if (requesterId !== targetUserId) return { error: 'forbidden' };

    const summary = await this.convService.getSummary(targetUserId);
    return { summary };
  }
}

/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('recent')
  async getRecent(@Req() req, @Query('limit') limit?: number) {
    return this.conversationsService.getRecent(req.user.sub, limit);
  }

  @Post()
  async saveConversation(
    @Req() req,
    @Body('role') role: 'user' | 'assistant',
    @Body('text') text: string,
    @Body('columns') columns?: string[],
    @Body('rows') rows?: string[][],
  ) {
    return this.conversationsService.saveConversation(
      req.user.sub,
      role,
      text,
      columns,
      rows,
    );
  }

  @Get('summary')
  async getSummary(@Req() req) {
    return this.conversationsService.getSummary(req.user.sub);
  }
}

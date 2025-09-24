/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversations')
@UseGuards(AuthGuard('jwt')) // ✅ protect all routes
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // ✅ Get recent conversations (default: 50)
  @Get('recent')
  async getRecent(@Req() req, @Query('limit') limit?: number) {
    return this.conversationsService.getRecent(req.user.sub, limit);
  }

  // ✅ Save a new Q/A pair
  @Post()
  async saveConversation(
    @Req() req,
    @Body('question') question: string,
    @Body('answer') answer: string,
  ) {
    return this.conversationsService.saveConversation(req.user.sub, question, answer);
  }

  // ✅ Get summarized conversation (AI summary)
  @Get('summary')
  async getSummary(@Req() req) {
    return this.conversationsService.getSummary(req.user.sub);
  }
}

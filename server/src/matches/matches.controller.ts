/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ConversationsService } from '../conversations/conversations.service';
import { AuthGuard } from '@nestjs/passport';

class AskDto {
  question: string;
  conversationId?: string; // ✅ allow continuing a conversation
  format?: 'test' | 'odi' | 't20' | 'all';
}

@Controller('matches')
@UseGuards(AuthGuard('jwt'))
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  // 🔒 Protected: ask a cricket-related question
  @Post('ask')
  async ask(@Body() body: AskDto, @Request() req: any) {
    if (!body?.question) {
      return { error: 'question is required' };
    }

    try {
      const userId = req.user?.userId || req.user?.sub;
      return await this.matchesService.answerQuestion(
        body.question,
        userId,
        body.conversationId, // ✅ pass conversationId if provided
        body.format,
      );
    } catch (err) {
      console.error(err);
      return {
        type: 'text',
        text: 'Sorry, an error occurred while processing your request.',
      };
    }
  }

  // 🔒 Protected: get all conversations for the user
  @Get('history')
  async listConversations(@Request() req: any, @Query('limit') limit?: number) {
    const userId = req.user?.userId || req.user?.sub;
    return this.conversationsService.listConversations(userId, limit);
  }

  // 🔒 Protected: get a specific conversation with messages
  @Get('history/:conversationId')
  async getConversation(@Param('conversationId') conversationId: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.conversationsService.getConversation(userId, conversationId);
  }
}

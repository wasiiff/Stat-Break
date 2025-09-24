/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '@nestjs/passport';

class AskDto {
  question: string;
  format?: 'test' | 'odi' | 't20' | 'all';
}

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // 🔒 Protected: ask a question
  @UseGuards(AuthGuard('jwt'))
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

  // 🔒 Protected: get user history
  @UseGuards(AuthGuard('jwt'))
  @Get('history/:userId')
  async history(@Param('userId') userId: string, @Request() req: any) {
    const requester = req.user;
    if (requester.userId !== userId) {
      return { error: 'forbidden' };
    }
    // TODO: plug in conversations service
    return { error: 'not implemented' };
  }
}

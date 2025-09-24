/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/converstion.schema';
import { Summary, SummaryDocument } from '../summarize/schemas/summary.schema';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);
  private MAX_ITEMS = Number(process.env.MAX_CONVERSATION_ITEMS || 50);
  private SUMMARY_THRESHOLD = Number(process.env.SUMMARY_THRESHOLD || 30);

  constructor(
    @InjectModel(Conversation.name) private convModel: Model<ConversationDocument>,
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    private readonly gemini: GeminiService,
  ) {}

  async getRecent(userId: string, limit = 50) {
    return this.convModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async saveConversation(
    userId: string,
    role: 'user' | 'assistant',
    text: string,
    columns?: string[],
    rows?: string[][],
  ) {
    let conv = await this.convModel
      .findOne({ userId })
      .sort({ updatedAt: -1 })
      .exec();

    if (!conv) {
      conv = new this.convModel({ userId, messages: [] });
    }

    conv.messages.push({ role, text, columns, rows, timestamp: new Date() });
    conv.updatedAt = new Date();
    await conv.save();

    await this.maybeSummarize(userId);
    return conv;
  }

  async maybeSummarize(userId: string) {
    const conv = await this.convModel
      .findOne({ userId })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    if (!conv || !conv.messages || conv.messages.length < this.SUMMARY_THRESHOLD) {
      return;
    }

    const items = conv.messages.slice(-this.SUMMARY_THRESHOLD);
    const blob = items
      .map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.text}`)
      .join('\n---\n');

    const prompt = `
Summarize the following conversation into 4-6 short bullet points of key facts and preferences (very short).
Conversation:
${blob}

Return only the short summary text.
    `.trim();

    try {
      const summaryText = (await this.gemini.ask(prompt)).trim();

      await this.summaryModel
        .findOneAndUpdate(
          { userId },
          { summary: summaryText, updatedAt: new Date() },
          { upsert: true },
        )
        .exec();

      // prune old conversations
      const docs = await this.convModel
        .find({ userId })
        .sort({ updatedAt: -1 })
        .limit(this.MAX_ITEMS)
        .select('_id')
        .lean()
        .exec();

      const idsToKeep = docs.map((d) => d._id);
      await this.convModel.deleteMany({ userId, _id: { $nin: idsToKeep } }).exec();
    } catch (err) {
      this.logger.error('Failed to summarize conversation', err);
    }
  }

  async getSummary(userId: string) {
    const s = await this.summaryModel.findOne({ userId }).lean().exec();
    return s ? s.summary : null;
  }
}

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
    return this.convModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean().exec();
  }

async saveConversation(
  userId: string,
  question: string,
  answer: string,
  columns?: string[],
  rows?: string[][],
) {
  const doc = await this.convModel.create({
    userId,
    question,
    answer,
    columns,
    rows,
    timestamp: new Date(),
  });
  await this.maybeSummarize(userId);
  return doc;
}


  async maybeSummarize(userId: string) {
    const count = await this.convModel.countDocuments({ userId });
    if (count < this.SUMMARY_THRESHOLD) return;

    // Build a text blob of the last N messages
    const items = await this.convModel.find({ userId }).sort({ createdAt: -1 }).limit(this.SUMMARY_THRESHOLD).lean().exec();
    const blob = items
      .reverse()
      .map(i => `Q: ${i.question}\nA: ${i.answer}`)
      .join('\n---\n');

    const prompt = `
Summarize the following conversation into 4-6 short bullet points of key facts and preferences (very short).
Conversation:
${blob}

Return only the short summary text.
    `.trim();

    try {
      const summaryText = (await this.gemini.ask(prompt)).trim();
      // upsert summary
      await this.summaryModel.findOneAndUpdate({ userId }, { summary: summaryText, updatedAt: new Date() }, { upsert: true }).exec();
      // prune older messages to keep DB small
      const toKeep = this.MAX_ITEMS;
      const idsToKeepDocs = await this.convModel.find({ userId }).sort({ createdAt: -1 }).limit(toKeep).select('_id').lean().exec();
      const idsToKeep = idsToKeepDocs.map(d => d._id);
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

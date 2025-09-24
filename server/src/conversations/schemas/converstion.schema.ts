/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) question: string;
  @Prop({ required: true }) answer: string; // plain text / summary
  @Prop({ type: [String], default: [] }) columns?: string[];
  @Prop({ type: [[String]], default: [] }) rows?: string[][];
  @Prop({ default: () => new Date() }) timestamp?: Date;
}


export const ConversationSchema = SchemaFactory.createForClass(Conversation);

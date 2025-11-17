// src/schema/iec/pending-request.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PendingRequstType } from 'src/common/enum/pending-request.enum';

export type PendingRequestDocument = PendingRequest & Document;

@Schema({ timestamps: true })
export class PendingRequest {
  @Prop({ required: true, unique: true })
  messageId: string;

  @Prop()
  noun: string;

  @Prop({ type: Object, default: {} })
  payload: any;

  @Prop({ 
    enum: PendingRequstType.PENDING,
    default: PendingRequstType.PENDING,
  })
  status: PendingRequstType;

  @Prop()
  correlationId?: string;

  @Prop()
  replyAddress?: string;
}

export const PendingRequestSchema = SchemaFactory.createForClass(PendingRequest);

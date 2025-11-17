// src/schema/meter-mgt/meter-reading.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeterReadingDocument = MeterReading & Document;

@Schema({ timestamps: true })
export class MeterReading {
  @Prop({ required: true })
  meterNumber: string;

  @Prop()
  obis: string; // OBIS code

  @Prop()
  value: string;

  @Prop()
  timestamp: Date;

  @Prop()
  source: string; // 'HES' | 'local'

  @Prop({ type: Object })
  raw: any;

  @Prop()
  transId?: string;

  @Prop()
  receivedToken?: string;
}

export const MeterReadingSchema = SchemaFactory.createForClass(MeterReading);

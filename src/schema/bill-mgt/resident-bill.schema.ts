import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResidentBillDocument = ResidentBill & Document;

@Schema({ 
    timestamps: true 
})
export class ResidentBill {
  @Prop({ required: true })
  userId: string;

  @Prop({  required: true })
  billId: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  amountPaid: number;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  lastPaymentDate: Date;

  @Prop({ type: Date })
  nextDueDate: Date;

  @Prop({ default: 'active' })
  status: string;
}

export const ResidentBillSchema = SchemaFactory.createForClass(ResidentBill);

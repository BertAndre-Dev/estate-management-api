import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillPaymentDocument = BillPayment & Document;

export enum PaymentStatus {
  NOTPAID = 'not-paid',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({
    timestamps: true
})
export class BillPayment {
    @Prop({ 
        required: true 
    })
    billId: string;

    @Prop({ 
        required: true 
    })
    userId: string;

    @Prop({
        required: true
    })
    transactionId: string;

    @Prop({ enum: ['monthly', 'quarterly', 'yearly'], required: true })
    frequency: 'monthly' | 'quarterly' | 'yearly';

    @Prop({ required: true })
    amountPaid: number;

    @Prop({ 
        enum: PaymentStatus, 
        default: PaymentStatus.PENDING 
    })
    paymentStatus: PaymentStatus;

    @Prop({ 
        type: Date 
    })
    nextDueDate: Date;
}

export const BillPaymentSchema = SchemaFactory.createForClass(BillPayment);
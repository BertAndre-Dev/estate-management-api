import { Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TransactionDocument = Transaction & Document;

export enum PaymentStatus {
  NOTPAID = 'not-paid',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({
    timestamps: true
})
export class Transaction {
    @Prop({
        required: true
    })
    walletId: string;

    @Prop({ 
        required: true, 
        enum: ['credit', 'debit'] 
    })
    type: 'credit' | 'debit';

    @Prop({ 
        required: true 
    })
    amount: number;

    @Prop({
        enum: PaymentStatus,
        default: PaymentStatus.NOTPAID,
        required: true,
    })
    paymentStatus?: PaymentStatus;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    tx_ref?: string;

    @Prop()
    description?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
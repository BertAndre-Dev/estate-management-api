import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
    @Prop({ 
        required: true 
    }) 
    meterNumber: string;
    @Prop({ 
        required: true 
    }) 
    amount: number;
    @Prop() 
    token: string;
    @Prop() 
    receiptNo: string;
    @Prop({ 
        default: 'pending' 
    }) status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

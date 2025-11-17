import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema({
    timestamps: true
})
export class Bill {
    @Prop({
        required: true
    })
    estateId: string;

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    description: string;

    @Prop({
        required: true
    })
    yearlyAmount: number;

    @Prop({ 
        default: true 
    })
    isActive: boolean;

    @Prop({ 
        default: true 
    })
    isServiceCharge: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
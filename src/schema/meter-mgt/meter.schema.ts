import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type MeterDocument = Meter & Document;


@Schema({ timestamps: true })
export class Meter {
  @Prop() 
    meterNumber: string;

    @Prop()
    mRID?: string;

    @Prop() 
    userId?: string;

    @Prop()
    refName?: string;

    @Prop()
    refCode?: string;

    @Prop({ 
        default: true 
    }) 
    isActive: boolean;

    @Prop({ 
        default: false 
    }) 
    isAssigned: boolean;

    @Prop() 
    estateId: string;

    @Prop() 
    addressId?: string;

    @Prop({
        default: 0
    }) 
    lastCredit?: number;

    @Prop()
    lastSeen?: Date;

    @Prop()
    model?: string;

    @Prop({ type: Object })
    vendorData?: any;
}

export const MeterSchema = SchemaFactory.createForClass(Meter);

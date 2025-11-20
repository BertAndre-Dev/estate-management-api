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

    // --- fields used by realtime monitor & vend flows ---
    // Supported data types returned by vendor/OBIS service (array of objects)
    @Prop({ type: Array, default: [] })
    supportedDataTypes?: any[];

    // Last reading snapshot stored on the Meter document (timestamp, energy, consumption)
    @Prop({ type: Object, default: null })
    lastReading?: { timestamp?: string; energy?: number; consumption?: number } | null;

    // Last token energy (kWh) received from a vend (used to compute prepaid balance)
    @Prop({ type: Number, default: 0 })
    lastTokenKwh?: number;

    // Computed balance (kWh) for prepaid meters
    @Prop({ type: Number, default: 0 })
    balance?: number;
}

export const MeterSchema = SchemaFactory.createForClass(Meter);

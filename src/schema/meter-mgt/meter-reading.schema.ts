// src/schema/meter-mgt/meter-reading.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeterReadingDocument = MeterReading & Document;

@Schema({ timestamps: true })
export class MeterReading {
  @Prop({ required: true })
  meterNumber: string;

  @Prop()
  obis: string; // OBIS code used for the reading

  @Prop()
  value: string; // processed / parsed value

  @Prop()
  timestamp: Date; // reading timestamp from meter

  @Prop()
  name?: string; // human friendly name from OBIS transform

  @Prop()
  category?: string; // energy | diagnostic | status

  @Prop()
  unit?: string; // unit of the value (kWh, V, A, etc)

  @Prop()
  source: string; // HES | gateway | realtime

  @Prop({ type: Object })
  raw: any; // full XML response parsed

  @Prop()
  transId?: string;

  @Prop()
  receivedToken?: string;

  @Prop()
  amount?: number; // monetary amount associated with a vend / transaction

  @Prop({ type: Object })
  parsed?: any; // optional parsed vendor response shape

  // ------------------------------
  // 🔥 REAL-TIME DIAGNOSTIC FIELDS
  // ------------------------------

  @Prop()
  phase?: 'L1' | 'L2' | 'L3'; // which phase this reading applies to

  @Prop()
  voltage?: number; // V

  @Prop()
  current?: number; // A

  @Prop()
  powerFactor?: number; // PF

  @Prop()
  activePower?: number; // kW

  @Prop()
  reactivePower?: number; // kVAR

  // ------------------------------
  // 🔥 REAL-TIME ENERGY TRACKING
  // ------------------------------

  @Prop()
  energyImport?: number; // kWh

  @Prop()
  energyExport?: number; // kWh

  @Prop()
  consumption?: number; // delta consumption from previous reading

  @Prop()
  balanceKwh?: number; // remaining credit (for prepaid meters)

  // ------------------------------
  // 🔥 ALERTS & EVENT FLAGS
  // ------------------------------
  @Prop({ default: false })
  lowBalanceAlert?: boolean;

  @Prop({ default: false })
  overloadAlert?: boolean;

  @Prop({ default: false })
  phaseFailureAlert?: boolean;

  @Prop({ default: false })
  voltageSagAlert?: boolean;

  @Prop({ default: false })
  voltageSwellAlert?: boolean;

  @Prop()
  eventType?: string; // "TOKEN_USED" | "LOW_BALANCE" | "PHASE_FAILURE" | ...
}

export const MeterReadingSchema = SchemaFactory.createForClass(MeterReading);

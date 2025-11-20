import { Document } from 'mongoose';
export type MeterReadingDocument = MeterReading & Document;
export declare class MeterReading {
    meterNumber: string;
    obis: string;
    value: string;
    timestamp: Date;
    name?: string;
    category?: string;
    unit?: string;
    source: string;
    raw: any;
    transId?: string;
    receivedToken?: string;
    amount?: number;
    parsed?: any;
    phase?: 'L1' | 'L2' | 'L3';
    voltage?: number;
    current?: number;
    powerFactor?: number;
    activePower?: number;
    reactivePower?: number;
    energyImport?: number;
    energyExport?: number;
    consumption?: number;
    balanceKwh?: number;
    lowBalanceAlert?: boolean;
    overloadAlert?: boolean;
    phaseFailureAlert?: boolean;
    voltageSagAlert?: boolean;
    voltageSwellAlert?: boolean;
    eventType?: string;
}
export declare const MeterReadingSchema: import("mongoose").Schema<MeterReading, import("mongoose").Model<MeterReading, any, any, any, Document<unknown, any, MeterReading, any, {}> & MeterReading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MeterReading, Document<unknown, {}, import("mongoose").FlatRecord<MeterReading>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MeterReading> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

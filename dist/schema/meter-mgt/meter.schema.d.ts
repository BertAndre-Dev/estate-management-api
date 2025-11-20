import { Document } from 'mongoose';
export type MeterDocument = Meter & Document;
export declare class Meter {
    meterNumber: string;
    mRID?: string;
    userId?: string;
    refName?: string;
    refCode?: string;
    isActive: boolean;
    isAssigned: boolean;
    estateId: string;
    addressId?: string;
    lastCredit?: number;
    lastSeen?: Date;
    model?: string;
    vendorData?: any;
    supportedDataTypes?: any[];
    lastReading?: {
        timestamp?: string;
        energy?: number;
        consumption?: number;
    } | null;
    lastTokenKwh?: number;
    balance?: number;
}
export declare const MeterSchema: import("mongoose").Schema<Meter, import("mongoose").Model<Meter, any, any, any, Document<unknown, any, Meter, any, {}> & Meter & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Meter, Document<unknown, {}, import("mongoose").FlatRecord<Meter>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Meter> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

import { Document } from 'mongoose';
export type BillDocument = Bill & Document;
export declare class Bill {
    estateId: string;
    name: string;
    description: string;
    yearlyAmount: number;
    isActive: boolean;
    isServiceCharge: boolean;
}
export declare const BillSchema: import("mongoose").Schema<Bill, import("mongoose").Model<Bill, any, any, any, Document<unknown, any, Bill, any, {}> & Bill & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bill, Document<unknown, {}, import("mongoose").FlatRecord<Bill>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Bill> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

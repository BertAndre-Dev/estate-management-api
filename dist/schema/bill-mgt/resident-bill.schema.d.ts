import { Document, Types } from 'mongoose';
export type ResidentBillDocument = ResidentBill & Document;
export declare class ResidentBill {
    userId: string;
    billId: string;
    frequency: string;
    amountPaid: number;
    startDate: Date;
    lastPaymentDate: Date;
    nextDueDate: Date;
    status: string;
}
export declare const ResidentBillSchema: import("mongoose").Schema<ResidentBill, import("mongoose").Model<ResidentBill, any, any, any, Document<unknown, any, ResidentBill, any, {}> & ResidentBill & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ResidentBill, Document<unknown, {}, import("mongoose").FlatRecord<ResidentBill>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ResidentBill> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

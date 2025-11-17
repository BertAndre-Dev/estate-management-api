import { Document } from 'mongoose';
export type BillPaymentDocument = BillPayment & Document;
export declare enum PaymentStatus {
    NOTPAID = "not-paid",
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class BillPayment {
    billId: string;
    userId: string;
    transactionId: string;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    amountPaid: number;
    paymentStatus: PaymentStatus;
    nextDueDate: Date;
}
export declare const BillPaymentSchema: import("mongoose").Schema<BillPayment, import("mongoose").Model<BillPayment, any, any, any, Document<unknown, any, BillPayment, any, {}> & BillPayment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BillPayment, Document<unknown, {}, import("mongoose").FlatRecord<BillPayment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BillPayment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

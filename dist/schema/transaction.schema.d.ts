import { Document, Types } from "mongoose";
export type TransactionDocument = Transaction & Document;
export declare enum PaymentStatus {
    NOTPAID = "not-paid",
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class Transaction {
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    paymentStatus?: PaymentStatus;
    tx_ref?: string;
    description?: string;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

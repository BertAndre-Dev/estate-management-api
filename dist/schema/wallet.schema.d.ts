import { Document, Types } from "mongoose";
export type WalletDocument = Wallet & Document;
export declare class Wallet {
    userId: string;
    balance: number;
    temporaryBalance?: number;
    lockedBalance: number;
}
export declare const WalletSchema: import("mongoose").Schema<Wallet, import("mongoose").Model<Wallet, any, any, any, Document<unknown, any, Wallet, any, {}> & Wallet & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wallet, Document<unknown, {}, import("mongoose").FlatRecord<Wallet>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Wallet> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

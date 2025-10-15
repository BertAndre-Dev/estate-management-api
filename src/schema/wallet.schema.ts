import { Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type WalletDocument = Wallet & Document;

@Schema({
    timestamps: true
})
export class Wallet {
    @Prop({
        required: true
    })
    userId: string;

    @Prop({
        default: 0,
        required: true
    })
    balance: number;

    @Prop({
        default: 0,
    })
    temporaryBalance?: number;

    @Prop({
        default: 0
    })
    lockedBalance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
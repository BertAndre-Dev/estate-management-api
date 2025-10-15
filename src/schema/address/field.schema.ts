import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { FieldItem } from "./field-items.schema";


export type FieldDocument = Field & Document;

@Schema({
    timestamps: true
})
export class Field {
    @Prop({
        required: true
    })
    estateId: string;

    @Prop({
        type: [FieldItem],
        default: []
    })
    field: FieldItem[];

    @Prop({
        default: true
    })
    isActive: boolean;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
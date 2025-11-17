import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



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
        required: true 
    })
    label: string;

    @Prop({ 
        required: true 
    })
    key: string;

    @Prop({
        default: true
    })
    isActive: boolean;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
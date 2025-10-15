import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";


export type EntryDocument = Entry & Document;
@Schema({
    timestamps: true
})
export class Entry {
    @Prop({
        required: true
    })
    estateId: string;

    @Prop({
        required: true
    })
    fieldId: string;

    @Prop({ 
        type: Map, 
        of: SchemaTypes.Mixed 
    })
    data: Map<string, any>;
}


export const EntrySchema = SchemaFactory.createForClass(Entry);
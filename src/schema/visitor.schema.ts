import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';


export class VisitorDetails {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    phone: string;

    @Prop()
    purpose: string;
}

const VisitorDetailsSchema = SchemaFactory.createForClass(VisitorDetails);


export type VisitorDocument = Visitor & Document;

@Schema({
    timestamps: true
})

export class Visitor {
    @Prop()
    residentId : string;

    @Prop()
    addressId: string;

    @Prop({
        type: [VisitorDetailsSchema],
        required: true,
        default: []
    })
    visitor: VisitorDetails[];
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);


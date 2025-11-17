import { Document } from 'mongoose';
export declare class VisitorDetails {
    firstName: string;
    lastName: string;
    phone: string;
    purpose: string;
}
export type VisitorDocument = Visitor & Document;
export declare class Visitor {
    residentId: string;
    addressId: string;
    visitor: VisitorDetails[];
}
export declare const VisitorSchema: import("mongoose").Schema<Visitor, import("mongoose").Model<Visitor, any, any, any, Document<unknown, any, Visitor, any, {}> & Visitor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Visitor, Document<unknown, {}, import("mongoose").FlatRecord<Visitor>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Visitor> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

import { Document } from 'mongoose';
export type EstateDocument = Estate & Document;
export declare class Estate {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
}
export declare const EstateSchema: import("mongoose").Schema<Estate, import("mongoose").Model<Estate, any, any, any, Document<unknown, any, Estate, any, {}> & Estate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Estate, Document<unknown, {}, import("mongoose").FlatRecord<Estate>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Estate> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

import { Document } from "mongoose";
export type EntryDocument = Entry & Document;
export declare class Entry {
    estateId: string;
    fieldId: string;
    data: Map<string, any>;
}
export declare const EntrySchema: import("mongoose").Schema<Entry, import("mongoose").Model<Entry, any, any, any, Document<unknown, any, Entry, any, {}> & Entry & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Entry, Document<unknown, {}, import("mongoose").FlatRecord<Entry>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Entry> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

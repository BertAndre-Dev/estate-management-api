import { Document } from 'mongoose';
import { PendingRequstType } from 'src/common/enum/pending-request.enum';
export type PendingRequestDocument = PendingRequest & Document;
export declare class PendingRequest {
    messageId: string;
    noun: string;
    payload: any;
    status: PendingRequstType;
    correlationId?: string;
    replyAddress?: string;
}
export declare const PendingRequestSchema: import("mongoose").Schema<PendingRequest, import("mongoose").Model<PendingRequest, any, any, any, Document<unknown, any, PendingRequest, any, {}> & PendingRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PendingRequest, Document<unknown, {}, import("mongoose").FlatRecord<PendingRequest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PendingRequest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

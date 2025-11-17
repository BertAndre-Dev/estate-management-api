import { Model } from 'mongoose';
import { PendingRequestDocument } from 'src/schema/ice/pending-request.schema';
export declare class IecClientService {
    private pendingModel;
    private readonly logger;
    private baseUrl;
    private hesToken;
    private hesTokenFetchedAt;
    private TOKEN_TTL;
    constructor(pendingModel: Model<PendingRequestDocument>);
    private getToken;
    private resolveVerb;
    private postRequest;
    getMeterReadings(meterNumber: string, obis: string): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    disconnectMeter(meterNumber: string): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    reconnectMeter(meterNumber: string): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    getHistoryData(meterNumber: string, dTypeID: string, start: string, end: string): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    pageMeters(): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    detailsMeter(meterNumber: string): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
}

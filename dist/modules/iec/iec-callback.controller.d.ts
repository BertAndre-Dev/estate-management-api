import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { PendingRequestDocument } from 'src/schema/ice/pending-request.schema';
import { MeterReadingDocument } from 'src/schema/meter-mgt/meter-reading.schema';
import { ObisService } from 'src/common/obis/obis.service';
export declare class IecCallbackController {
    private pendingModel;
    private readingModel;
    private obis;
    private readonly logger;
    constructor(pendingModel: Model<PendingRequestDocument>, readingModel: Model<MeterReadingDocument>, obis: ObisService);
    receive(req: Request & {
        rawBody?: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}

import { IecClientService } from './iec-client.service';
import { GetMeterReadingsDto } from '../../dto/iec-dto/get-meter-readings.dto';
import { DisconnectMeterDto } from '../../dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from '../../dto/iec-dto/reconnect-meter.dto';
import { HistoryDataDto } from '../../dto/iec-dto/history-data.dto';
import { DetailsMeterDto } from '../../dto/iec-dto/details-meter.dto';
export declare class IecController {
    private readonly iecClient;
    constructor(iecClient: IecClientService);
    debugToken(): Promise<{
        message: string;
    }>;
    getMeterReadings(dto: GetMeterReadingsDto): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    disconnect(dto: DisconnectMeterDto): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    reconnect(dto: ReconnectMeterDto): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    history(dto: HistoryDataDto): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    listMeters(): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
    details(dto: DetailsMeterDto): Promise<{
        noun: string;
        messageId: string;
        correlationId: string;
        ack: null;
        raw: any;
        status: number;
    }>;
}

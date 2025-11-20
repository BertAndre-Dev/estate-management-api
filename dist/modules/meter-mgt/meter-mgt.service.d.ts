import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { MeterReadingDocument } from 'src/schema/meter-mgt/meter-reading.schema';
import { MeterDocument } from 'src/schema/meter-mgt/meter.schema';
import { MeterDto } from 'src/dto/meter.dto';
import { VendPowerDto } from 'src/dto/vend-power.dto';
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { WalletDocument } from 'src/schema/wallet.schema';
import { Transaction } from 'src/schema/transaction.schema';
import { EntryDocument } from 'src/schema/address/entry.schema';
import { IecClientService } from '../iec/iec-client.service';
import { DisconnectMeterDto } from 'src/dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from 'src/dto/iec-dto/reconnect-meter.dto';
import { RealtimeGateway } from "src/common/utils/real-time/real-time.gateway";
export declare class MeterMgtService {
    private http;
    private transaction;
    private ice;
    private gateway;
    private meterReadingModel;
    private meterModel;
    private walletModel;
    private transactionModel;
    private entryModel;
    private baseUrl;
    private readonly logger;
    constructor(http: HttpService, transaction: TransactionMgtService, ice: IecClientService, gateway: RealtimeGateway, meterReadingModel: Model<MeterReadingDocument>, meterModel: Model<MeterDocument>, walletModel: Model<WalletDocument>, transactionModel: Model<Transaction>, entryModel: Model<EntryDocument>);
    monitorMeters(): Promise<void>;
    addMeter(dto: MeterDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    removeMeter(dto: MeterDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    reassignMeter(dto: MeterDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    assignMeterToAddress(dto: MeterDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getMeterByAddress(addressId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateMeter(id: string, dto: MeterDto): Promise<{
        success: boolean;
        message: string;
    }>;
    trialVend(dto: VendPowerDto): Promise<{
        success: boolean;
        message: string;
        data: any;
        transId: string;
    }>;
    vend(dto: VendPowerDto, transId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    disconnectMeter(dto: DisconnectMeterDto): Promise<{
        message: string;
        data: any;
    }>;
    reconnectMeter(dto: ReconnectMeterDto): Promise<{
        message: string;
        data: any;
    }>;
    private lookupMeterFromMerchant;
    private enrichMeterWithVendorData;
    getMetersByEstateId(estateId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMeter(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private getVendorAuthToken;
    private verifyMeterWithVendor;
    private registerMeterWithVendor;
    private updateMeterOnVendor;
    private formatLocalDateTime;
}

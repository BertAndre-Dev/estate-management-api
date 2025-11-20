import { MeterMgtService } from './meter-mgt.service';
import { MeterDto } from 'src/dto/meter.dto';
import { VendPowerDto } from 'src/dto/vend-power.dto';
import { DisconnectMeterDto } from 'src/dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from 'src/dto/iec-dto/reconnect-meter.dto';
export declare class MeterMgtController {
    private readonly meterMgtService;
    constructor(meterMgtService: MeterMgtService);
    addMeter(dto: MeterDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    assignMeterToAddress(dto: MeterDto): Promise<{
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
    updateMeter(id: string, dto: MeterDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getMeter(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getMeterByAddress(addressId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getMetersByEstate(estateId: string, page?: number, limit?: number): Promise<{
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
    getRealtimeReading(meterNumber: string): Promise<{
        success: boolean;
        message: string;
        data: {
            meterNumber: string;
            energy: number;
            timestamp: Date;
        };
    }>;
    getRealtimeBalance(meterNumber: string): Promise<{
        success: boolean;
        message: string;
        data: {
            meterNumber: string;
            balance: number;
            used: number;
            timestamp: Date;
        };
    }>;
    getConsumptionChart(meterNumber: string, range?: "daily" | "weekly" | "monthly" | "yearly"): Promise<{
        success: boolean;
        message: string;
        data: {
            meterNumber: string;
            range: "daily" | "weekly" | "monthly" | "yearly";
            from: Date;
            to: Date;
            count: number;
            chart: {
                time: Date;
                value: number;
            }[];
        };
    }>;
    trialVend(dto: VendPowerDto): Promise<{
        success: boolean;
        message: string;
        data: any;
        transId: string;
    }>;
    vend(dto: VendPowerDto): Promise<{
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
}

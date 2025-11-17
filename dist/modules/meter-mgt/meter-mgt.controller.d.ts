import { MeterMgtService } from './meter-mgt.service';
import { MeterDto } from 'src/dto/meter.dto';
import { VendPowerDto } from 'src/dto/vend-power.dto';
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
    toggleMeterStatus(meterNumber: string, isActive: string): Promise<{
        success: boolean;
        message: string;
        data: any;
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
}

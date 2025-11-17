import { EstateMgtService } from './estate-mgt.service';
import { EstateDto } from 'src/dto/estate.dto';
export declare class EstateMgtController {
    private readonly estate;
    constructor(estate: EstateMgtService);
    createEstate(dto: EstateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateEstate(id: string, dto: EstateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteEstate(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getEstate(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAllEstate(page: number, limit: number, search: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        pagination: {
            total: number;
            currentPage: number;
            totalPages: number;
            pageSize: number;
        };
    }>;
    suspendEstate(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateEstate(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

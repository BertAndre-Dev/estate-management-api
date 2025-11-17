import { Model } from 'mongoose';
import { EstateDocument } from 'src/schema/estate.schema';
import { EstateDto } from 'src/dto/estate.dto';
import { UserDocument } from 'src/schema/user.schema';
export declare class EstateMgtService {
    private estateModel;
    private userModel;
    constructor(estateModel: Model<EstateDocument>, userModel: Model<UserDocument>);
    createEstate(dto: EstateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateEstate(estateId: string, dto: EstateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAllEstates(page?: number, limit?: number, search?: string): Promise<{
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
    getEstate(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteEstate(id: string): Promise<{
        success: boolean;
        message: string;
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

import { Model } from 'mongoose';
import { Visitor } from 'src/schema/visitor.schema';
import { VisitorDto } from 'src/dto/visitor.dto';
export declare class VisitorMgtService {
    private visitorModel;
    constructor(visitorModel: Model<Visitor>);
    createVisitor(dto: VisitorDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateVisitor(visitorId: string, dto: VisitorDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllResidentVisitors(residentId: string, page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        pagination: {
            total: number;
            currentPage: number;
            totalPages: number;
            pageSize: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    getVisitor(visitorId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteVisitor(visitorId: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
}

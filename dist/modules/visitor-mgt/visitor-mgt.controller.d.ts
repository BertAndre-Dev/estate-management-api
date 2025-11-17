import { VisitorDto } from 'src/dto/visitor.dto';
import { VisitorMgtService } from './visitor-mgt.service';
export declare class VisitorMgtController {
    private readonly visitor;
    constructor(visitor: VisitorMgtService);
    createVisitor(dto: VisitorDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateVisitor(id: string, dto: VisitorDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteVisitor(id: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    getVisitor(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAllResidentVisitor(residentId: string, page: number, limit: number, search: string): Promise<{
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
}

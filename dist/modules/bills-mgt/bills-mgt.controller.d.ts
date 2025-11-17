import { BillsMgtService } from './bills-mgt.service';
import { CreateBillDto } from 'src/dto/bill-dto/create-bill.dto';
import { BillPaymentDto } from 'src/dto/bill-dto/bill-payment.dto';
export declare class BillsMgtController {
    private readonly bill;
    constructor(bill: BillsMgtService);
    createBill(dto: CreateBillDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    payBill(dto: BillPaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            bill: import("mongoose").Document<unknown, {}, import("../../schema/bill-mgt/bill.schema").BillDocument, {}, {}> & import("../../schema/bill-mgt/bill.schema").Bill & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            };
            transaction: any;
            nextDueDate: Date;
        };
    }>;
    updateBill(id: string, dto: CreateBillDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteBill(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getBill(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getResidentBills(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            _id: unknown;
            userId: string;
            billId: string;
            billName: string;
            frequency: string;
            amountPaid: number;
            startDate: Date;
            nextDueDate: Date;
            status: string;
            lastPaymentDate: Date;
        }[];
    }>;
    getAllBill(estateId: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        data: any;
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    suspendBill(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateBill(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

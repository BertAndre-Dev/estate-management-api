import { Model } from 'mongoose';
import { CreateBillDto } from 'src/dto/bill-dto/create-bill.dto';
import { BillPaymentDto } from 'src/dto/bill-dto/bill-payment.dto';
import { WalletDocument } from 'src/schema/wallet.schema';
import { Bill, BillDocument } from 'src/schema/bill-mgt/bill.schema';
import { ResidentBillDocument } from 'src/schema/bill-mgt/resident-bill.schema';
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { UserDocument } from 'src/schema/user.schema';
export declare class BillsMgtService {
    private billModel;
    private walletModel;
    private userModel;
    private residentBillModel;
    private readonly transactionMgt;
    constructor(billModel: Model<BillDocument>, walletModel: Model<WalletDocument>, userModel: Model<UserDocument>, residentBillModel: Model<ResidentBillDocument>, transactionMgt: TransactionMgtService);
    createBill(dto: CreateBillDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getBillsByEstate(estateId: string, page?: number, limit?: number): Promise<{
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
    getBill(billId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateBill(billId: string, dto: CreateBillDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteBill(billId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    suspendBill(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateBill(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    payBill(dto: BillPaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            bill: import("mongoose").Document<unknown, {}, BillDocument, {}, {}> & Bill & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            };
            transaction: any;
            nextDueDate: Date;
        };
    }>;
    getResidentBills(userId: string): Promise<{
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
}

import { TransactionMgtService } from './transaction-mgt.service';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { PaymentType } from 'src/common/enum/payment-type.enum';
export declare class TransactionMgtController {
    private readonly transaction;
    constructor(transaction: TransactionMgtService);
    createTransaction(dto: CreateTransactionDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getTransactionHistory(userId: string, page?: number, limit?: number): Promise<{
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
    getTransactionById(transactionId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    verifyTransaction(tx_ref: string, paymentType: PaymentType): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../schema/transaction.schema").TransactionDocument, {}, {}> & import("../../schema/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAllInflowTransactions(page: number, limit: number): Promise<{
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
}

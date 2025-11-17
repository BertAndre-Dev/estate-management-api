import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from 'src/schema/transaction.schema';
import { WalletDocument } from 'src/schema/wallet.schema';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { PaymentMgtService } from '../payment-mgt/payment-mgt.service';
import { PaymentType } from 'src/common/enum/payment-type.enum';
export declare class TransactionMgtService {
    private transactionModel;
    private walletModel;
    private readonly payment;
    constructor(transactionModel: Model<TransactionDocument>, walletModel: Model<WalletDocument>, payment: PaymentMgtService);
    createTransaction(dto: CreateTransactionDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    verifyTransaction(tx_ref: string, paymentType: PaymentType): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getAllInflowTransactions(page?: number, limit?: number): Promise<{
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
}

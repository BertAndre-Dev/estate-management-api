import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from 'src/schema/transaction.schema';
import { PaymentStatus } from 'src/schema/transaction.schema';
import { Wallet, WalletDocument } from 'src/schema/wallet.schema';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { toResponseObject } from 'src/common/utils/transform.util';
import { PaymentMgtService } from '../payment-mgt/payment-mgt.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TransactionMgtService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        private readonly payment: PaymentMgtService,
    ){}


    // create transaction
    async createTransaction(dto: CreateTransactionDto) {
        if (!dto.walletId || !dto.type || !dto.amount) {
            throw new BadRequestException("walletId, type, and amount are required.");
        }

        const wallet = await this.walletModel.findById(dto.walletId);
        if (!wallet) {
            throw new BadRequestException("Wallet does not exist.");
        }

        try {
            // generate tx_ref for payment
            const tx_ref = `tx-${uuidv4()}`;

            // Adjust wallet balance based on transaction type
            if (dto.type === 'debit' && wallet.balance < dto.amount) {
                throw new BadRequestException("Insufficient balance for debit transaction.");
            }

            let paymentStatus: PaymentStatus | undefined;

            if (dto.type === 'debit') {
                wallet.balance -= dto.amount;
                paymentStatus = PaymentStatus.PAID;
            } else {
                if (wallet.temporaryBalance === undefined) {
                    wallet.temporaryBalance = 0; // or whatever default value you want
                }
                wallet.temporaryBalance += dto.amount;
            }

            await wallet.save();

            const transaction = new this.transactionModel({
                ...dto,
                tx_ref,
                paymentStatus: paymentStatus,
            });
            const savedTransaction = await transaction.save();
            const response = toResponseObject(savedTransaction);

            return {
                success: true,
                message: "Transaction created successfully.",
                data: response
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // verify transaction
    async verifyTransaction(tx_ref: string) {
        try {
            const paymentResult = await this.payment.verifyPayment(tx_ref);

            const topStatus = paymentResult.status;
            const dataStatus = paymentResult.data?.status;

            let paymentStatus: PaymentStatus = PaymentStatus.PENDING;

            if (topStatus === 'success' && dataStatus === 'successful') {
            paymentStatus = PaymentStatus.PAID;
            } else if (dataStatus === 'failed') {
            paymentStatus = PaymentStatus.FAILED;
            }

            // Step 1: Find the transaction first
            const transaction = await this.transactionModel.findOne({ tx_ref });
            if (!transaction) {
            throw new NotFoundException('Transaction not found.');
            }

            // ✅ Prevent re-verification if already paid
            if (transaction.paymentStatus === PaymentStatus.PAID) {
                return {
                    success: true,
                    message: 'Transaction already verified and paid.',
                    data: transaction,
                };
            }

            // Step 2: Update transaction status
            transaction.paymentStatus = paymentStatus;
            await transaction.save();

            // Step 3: If payment was successful, update wallet balance
            if (paymentStatus === PaymentStatus.PAID) {
            const wallet = await this.walletModel.findById(transaction.walletId);
            if (!wallet) {
                throw new NotFoundException('Wallet not found.');
            }

            if (transaction.type === 'credit') {
                wallet.balance += transaction.amount;
                wallet.temporaryBalance = 0;
            } else if (transaction.type === 'debit') {
                wallet.balance -= transaction.amount;
            }

                await wallet.save();
            }

            return {
                success: true,
                message: 'Transaction verified successfully.',
                data: transaction,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get all transaction inflow with type credit + paymentStatus paid
    async getAllInflowTransactions(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const filter = { type: 'credit', paymentStatus: 'paid' };

            const [transactions, total] = await Promise.all([
            this.transactionModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.transactionModel.countDocuments(filter),
            ]);

            return {
                success: true,
                message: "All inflow transactions retrieved successfully.",
                data: toResponseObject(transactions),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get transactions
    async getTransactionHistory(userId: string) {
        try {
            if (!userId) {
                throw new BadRequestException("userId is required.");
            }
        
            // Fetch wallet
            const wallet = await this.walletModel.findOne({ userId });
            if (!wallet) {
                throw new BadRequestException("Wallet does not exist for this user.");
            }
        
            // Fetch transactions associated with the wallet
            const transactions = await this.transactionModel
                .find({ walletId: wallet._id })
                .sort({ createdAt: -1 }); // Most recent first
        
            return {
                success: true,
                message: "Transaction history retrieved successfully.",
                data: toResponseObject(transactions),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get transaction by id
    async getTransactionById(transactionId: string) {
        try {
            if (!transactionId) {
                throw new BadRequestException("transactionId is required.");
            }

            const transaction = await this.transactionModel.findById(transactionId);
            if (!transaction) {
                throw new NotFoundException("Transaction not found.");
            }
            return {
                success: true,
                message: "Transaction retrieved successfully.",
                data: toResponseObject(transaction),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }   
    }
}

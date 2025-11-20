var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from "../../schema/transaction.schema";
import { PaymentStatus } from "../../schema/transaction.schema";
import { Wallet } from "../../schema/wallet.schema";
import { toResponseObject } from "../../common/utils/transform.util";
import { PaymentMgtService } from '../payment-mgt/payment-mgt.service';
import { v4 as uuidv4 } from 'uuid';
let TransactionMgtService = class TransactionMgtService {
    transactionModel;
    walletModel;
    payment;
    constructor(transactionModel, walletModel, payment) {
        this.transactionModel = transactionModel;
        this.walletModel = walletModel;
        this.payment = payment;
    }
    async createTransaction(dto) {
        if (!dto.walletId || !dto.type || !dto.amount) {
            throw new BadRequestException("walletId, type, and amount are required.");
        }
        const wallet = await this.walletModel.findById(dto.walletId);
        if (!wallet) {
            throw new BadRequestException("Wallet does not exist.");
        }
        try {
            const tx_ref = `tx-${uuidv4()}`;
            if (dto.type === 'debit' && wallet.balance < dto.amount) {
                throw new BadRequestException("Insufficient balance for debit transaction.");
            }
            let paymentStatus;
            if (dto.type === 'debit') {
                wallet.balance -= dto.amount;
                paymentStatus = PaymentStatus.PAID;
            }
            else {
                if (wallet.temporaryBalance === undefined) {
                    wallet.temporaryBalance = 0;
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
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async verifyTransaction(tx_ref, paymentType) {
        try {
            const paymentResult = await this.payment.verifyPayment(tx_ref, paymentType);
            let paymentStatus = PaymentStatus.PENDING;
            if (paymentResult.status === 'success') {
                paymentStatus = PaymentStatus.PAID;
            }
            else {
                paymentStatus = PaymentStatus.PENDING;
            }
            const transaction = await this.transactionModel.findOne({ tx_ref });
            if (!transaction) {
                throw new NotFoundException('Transaction not found.');
            }
            if (transaction.paymentStatus === PaymentStatus.PAID) {
                return {
                    success: true,
                    message: 'Transaction already verified and paid.',
                    data: transaction,
                };
            }
            transaction.paymentStatus = paymentStatus;
            await transaction.save();
            if (paymentStatus === PaymentStatus.PAID) {
                const wallet = await this.walletModel.findById(transaction.walletId);
                if (!wallet) {
                    throw new NotFoundException('Wallet not found.');
                }
                if (transaction.type === 'credit') {
                    wallet.balance += transaction.amount;
                    wallet.temporaryBalance = 0;
                }
                else if (transaction.type === 'debit') {
                    wallet.balance -= transaction.amount;
                }
                await wallet.save();
            }
            return {
                success: true,
                message: 'Transaction verified successfully.',
                data: transaction,
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllInflowTransactions(page = 1, limit = 10) {
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
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getTransactionHistory(userId, page = 1, limit = 10) {
        try {
            if (!userId) {
                throw new BadRequestException("userId is required.");
            }
            const wallet = await this.walletModel.findOne({ userId });
            if (!wallet) {
                throw new BadRequestException("Wallet does not exist for this user.");
            }
            const skip = (page - 1) * limit;
            const total = await this.transactionModel.countDocuments({ walletId: wallet._id });
            const transactions = await this.transactionModel
                .find({ walletId: wallet._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return {
                success: true,
                message: "Transaction history retrieved successfully.",
                data: toResponseObject(transactions),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getTransactionById(transactionId) {
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
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
TransactionMgtService = __decorate([
    Injectable(),
    __param(0, InjectModel(Transaction.name)),
    __param(1, InjectModel(Wallet.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        PaymentMgtService])
], TransactionMgtService);
export { TransactionMgtService };
//# sourceMappingURL=transaction-mgt.service.js.map
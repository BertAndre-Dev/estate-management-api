"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMgtService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../../schema/transaction.schema");
const transaction_schema_2 = require("../../schema/transaction.schema");
const wallet_schema_1 = require("../../schema/wallet.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const payment_mgt_service_1 = require("../payment-mgt/payment-mgt.service");
const uuid_1 = require("uuid");
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
            throw new common_1.BadRequestException("walletId, type, and amount are required.");
        }
        const wallet = await this.walletModel.findById(dto.walletId);
        if (!wallet) {
            throw new common_1.BadRequestException("Wallet does not exist.");
        }
        try {
            const tx_ref = `tx-${(0, uuid_1.v4)()}`;
            if (dto.type === 'debit' && wallet.balance < dto.amount) {
                throw new common_1.BadRequestException("Insufficient balance for debit transaction.");
            }
            let paymentStatus;
            if (dto.type === 'debit') {
                wallet.balance -= dto.amount;
                paymentStatus = transaction_schema_2.PaymentStatus.PAID;
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
            const response = (0, transform_util_1.toResponseObject)(savedTransaction);
            return {
                success: true,
                message: "Transaction created successfully.",
                data: response
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyTransaction(tx_ref, paymentType) {
        try {
            const paymentResult = await this.payment.verifyPayment(tx_ref, paymentType);
            let paymentStatus = transaction_schema_2.PaymentStatus.PENDING;
            if (paymentResult.status === 'success') {
                paymentStatus = transaction_schema_2.PaymentStatus.PAID;
            }
            else {
                paymentStatus = transaction_schema_2.PaymentStatus.PENDING;
            }
            const transaction = await this.transactionModel.findOne({ tx_ref });
            if (!transaction) {
                throw new common_1.NotFoundException('Transaction not found.');
            }
            if (transaction.paymentStatus === transaction_schema_2.PaymentStatus.PAID) {
                return {
                    success: true,
                    message: 'Transaction already verified and paid.',
                    data: transaction,
                };
            }
            transaction.paymentStatus = paymentStatus;
            await transaction.save();
            if (paymentStatus === transaction_schema_2.PaymentStatus.PAID) {
                const wallet = await this.walletModel.findById(transaction.walletId);
                if (!wallet) {
                    throw new common_1.NotFoundException('Wallet not found.');
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
            throw new common_1.BadRequestException(error.message);
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
                data: (0, transform_util_1.toResponseObject)(transactions),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getTransactionHistory(userId, page = 1, limit = 10) {
        try {
            if (!userId) {
                throw new common_1.BadRequestException("userId is required.");
            }
            const wallet = await this.walletModel.findOne({ userId });
            if (!wallet) {
                throw new common_1.BadRequestException("Wallet does not exist for this user.");
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
                data: (0, transform_util_1.toResponseObject)(transactions),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getTransactionById(transactionId) {
        try {
            if (!transactionId) {
                throw new common_1.BadRequestException("transactionId is required.");
            }
            const transaction = await this.transactionModel.findById(transactionId);
            if (!transaction) {
                throw new common_1.NotFoundException("Transaction not found.");
            }
            return {
                success: true,
                message: "Transaction retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(transaction),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.TransactionMgtService = TransactionMgtService;
exports.TransactionMgtService = TransactionMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        payment_mgt_service_1.PaymentMgtService])
], TransactionMgtService);
//# sourceMappingURL=transaction-mgt.service.js.map
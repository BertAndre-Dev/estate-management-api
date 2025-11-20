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
import { Controller, Get, Post, Query, Body, UseGuards, Param, BadRequestException, } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiBearerAuth, ApiParam, } from '@nestjs/swagger';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Role } from "../../common/enum/roles.enum";
import { Roles } from "../../common/decorators/roles.decorstor";
import { TransactionMgtService } from './transaction-mgt.service';
import { CreateTransactionDto } from "../../dto/transaction.dto";
import { PaymentType } from "../../common/enum/payment-type.enum";
let TransactionMgtController = class TransactionMgtController {
    transaction;
    constructor(transaction) {
        this.transaction = transaction;
    }
    async createTransaction(dto) {
        try {
            return await this.transaction.createTransaction(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getTransactionHistory(userId, page = 1, limit = 10) {
        try {
            return await this.transaction.getTransactionHistory(userId, Number(page), Number(limit));
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getTransactionById(transactionId) {
        try {
            return await this.transaction.getTransactionById(transactionId);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async verifyTransaction(tx_ref, paymentType) {
        try {
            if (!paymentType) {
                throw new BadRequestException(`paymentType is required. Allowed values: ${Object.values(PaymentType).join(', ')}`);
            }
            return await this.transaction.verifyTransaction(tx_ref, paymentType);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllInflowTransactions(page, limit) {
        try {
            return await this.transaction.getAllInflowTransactions(page, limit);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post(''),
    ApiOperation({ summary: 'Create a new transaction' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "createTransaction", null);
__decorate([
    Get('/history'),
    ApiOperation({ summary: 'Get transaction history for a user (paginated)' }),
    ApiQuery({ name: 'userId', required: true }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, Query('userId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getTransactionHistory", null);
__decorate([
    Get('/by-id/:transactionId'),
    ApiOperation({ summary: 'Get transaction details by ID' }),
    ApiParam({ name: 'transactionId', required: true }),
    __param(0, Param('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getTransactionById", null);
__decorate([
    Post('/verify'),
    ApiOperation({ summary: 'Verify a transaction and optionally trigger payouts' }),
    ApiQuery({ name: 'tx_ref', required: true, description: 'Flutterwave transaction reference' }),
    ApiQuery({
        name: 'paymentType',
        required: true,
        enum: PaymentType,
        description: 'fundWallet | serviceCharge | electricity'
    }),
    __param(0, Query('tx_ref')),
    __param(1, Query('paymentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "verifyTransaction", null);
__decorate([
    Get('/transaction-inflow'),
    ApiOperation({
        summary: 'Get all inflow transactions',
        description: 'This API retrieves all inflow transactions.',
    }),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getAllInflowTransactions", null);
TransactionMgtController = __decorate([
    ApiTags('Transaction Managemt'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Roles(Role.SUPERADMIN, Role.RESIDENT),
    Controller('/api/v1/transaction-mgt'),
    __metadata("design:paramtypes", [TransactionMgtService])
], TransactionMgtController);
export { TransactionMgtController };
//# sourceMappingURL=transaction-mgt.controller.js.map
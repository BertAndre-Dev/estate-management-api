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
exports.TransactionMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_enum_1 = require("../../common/enum/roles.enum");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const transaction_mgt_service_1 = require("./transaction-mgt.service");
const transaction_dto_1 = require("../../dto/transaction.dto");
const payment_type_enum_1 = require("../../common/enum/payment-type.enum");
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
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getTransactionHistory(userId, page = 1, limit = 10) {
        try {
            return await this.transaction.getTransactionHistory(userId, Number(page), Number(limit));
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getTransactionById(transactionId) {
        try {
            return await this.transaction.getTransactionById(transactionId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyTransaction(tx_ref, paymentType) {
        try {
            if (!paymentType) {
                throw new common_1.BadRequestException(`paymentType is required. Allowed values: ${Object.values(payment_type_enum_1.PaymentType).join(', ')}`);
            }
            return await this.transaction.verifyTransaction(tx_ref, paymentType);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllInflowTransactions(page, limit) {
        try {
            return await this.transaction.getAllInflowTransactions(page, limit);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.TransactionMgtController = TransactionMgtController;
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)('/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history for a user (paginated)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)('/by-id/:transactionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'transactionId', required: true }),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getTransactionById", null);
__decorate([
    (0, common_1.Post)('/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a transaction and optionally trigger payouts' }),
    (0, swagger_1.ApiQuery)({ name: 'tx_ref', required: true, description: 'Flutterwave transaction reference' }),
    (0, swagger_1.ApiQuery)({
        name: 'paymentType',
        required: true,
        enum: payment_type_enum_1.PaymentType,
        description: 'fundWallet | serviceCharge | electricity'
    }),
    __param(0, (0, common_1.Query)('tx_ref')),
    __param(1, (0, common_1.Query)('paymentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "verifyTransaction", null);
__decorate([
    (0, common_1.Get)('/transaction-inflow'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all inflow transactions',
        description: 'This API retrieves all inflow transactions.',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TransactionMgtController.prototype, "getAllInflowTransactions", null);
exports.TransactionMgtController = TransactionMgtController = __decorate([
    (0, swagger_1.ApiTags)('Transaction Managemt'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, common_1.Controller)('/api/v1/transaction-mgt'),
    __metadata("design:paramtypes", [transaction_mgt_service_1.TransactionMgtService])
], TransactionMgtController);
//# sourceMappingURL=transaction-mgt.controller.js.map
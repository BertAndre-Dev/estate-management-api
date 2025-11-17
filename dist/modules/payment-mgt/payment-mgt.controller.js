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
exports.PaymentMgtController = void 0;
const common_1 = require("@nestjs/common");
const payment_mgt_service_1 = require("./payment-mgt.service");
const roles_enum_1 = require("../../common/enum/roles.enum");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const swagger_1 = require("@nestjs/swagger");
const flutter_wave_dto_1 = require("../../dto/flutter-wave.dto");
const payment_type_enum_1 = require("../../common/enum/payment-type.enum");
let PaymentMgtController = class PaymentMgtController {
    payment;
    constructor(payment) {
        this.payment = payment;
    }
    async initializePayment(body) {
        try {
            return await this.payment.initializePayment(body);
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Payment initialization failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPayment(tx_ref, paymentType) {
        if (!paymentType) {
            throw new common_1.HttpException(`paymentType query parameter is required. Allowed values: ${Object.values(payment_type_enum_1.PaymentType).join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.payment.verifyPayment(tx_ref, paymentType);
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data?.message || 'Payment verification failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPaymentMethods(country) {
        try {
            const paymentMethods = await this.payment.getPaymentMethodsByCountry(country);
            return {
                success: true,
                message: "Payment methods retrieved successfully.",
                paymentMethods
            };
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message || 'Failed to retrieve payment methods.' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PaymentMgtController = PaymentMgtController;
__decorate([
    (0, common_1.Post)('initialize'),
    (0, swagger_1.ApiBody)({ type: flutter_wave_dto_1.InitializePaymentDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flutter_wave_dto_1.InitializePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "initializePayment", null);
__decorate([
    (0, common_1.Get)('verify/:tx_ref'),
    (0, swagger_1.ApiParam)({ name: 'tx_ref', required: true }),
    (0, swagger_1.ApiQuery)({
        name: 'paymentType',
        required: true,
        enum: payment_type_enum_1.PaymentType,
        description: 'fundWallet | serviceCharge | electricity'
    }),
    __param(0, (0, common_1.Param)('tx_ref')),
    __param(1, (0, common_1.Query)('paymentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('payment-methods/:country'),
    (0, swagger_1.ApiParam)({ name: 'country', type: String, required: true }),
    __param(0, (0, common_1.Param)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "getPaymentMethods", null);
exports.PaymentMgtController = PaymentMgtController = __decorate([
    (0, swagger_1.ApiTags)('Payment Management'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('/api/v1/payment-mgt'),
    __metadata("design:paramtypes", [payment_mgt_service_1.PaymentMgtService])
], PaymentMgtController);
//# sourceMappingURL=payment-mgt.controller.js.map
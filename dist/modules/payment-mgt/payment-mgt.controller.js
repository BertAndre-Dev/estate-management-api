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
import { Controller, Post, Body, Query, Get, HttpException, HttpStatus, UseGuards, Param } from '@nestjs/common';
import { PaymentMgtService } from './payment-mgt.service';
import { Role } from "../../common/enum/roles.enum";
import { Roles } from "../../common/decorators/roles.decorstor";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InitializePaymentDto } from "../../dto/flutter-wave.dto";
import { PaymentType } from "../../common/enum/payment-type.enum";
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
            throw new HttpException(error?.response?.data || 'Payment initialization failed', HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPayment(tx_ref, paymentType) {
        if (!paymentType) {
            throw new HttpException(`paymentType query parameter is required. Allowed values: ${Object.values(PaymentType).join(', ')}`, HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.payment.verifyPayment(tx_ref, paymentType);
        }
        catch (error) {
            throw new HttpException(error?.response?.data?.message || 'Payment verification failed', HttpStatus.BAD_REQUEST);
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
            throw new HttpException({ success: false, message: error.message || 'Failed to retrieve payment methods.' }, HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    Post('initialize'),
    ApiBody({ type: InitializePaymentDto }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitializePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "initializePayment", null);
__decorate([
    Get('verify/:tx_ref'),
    ApiParam({ name: 'tx_ref', required: true }),
    ApiQuery({
        name: 'paymentType',
        required: true,
        enum: PaymentType,
        description: 'fundWallet | serviceCharge | electricity'
    }),
    __param(0, Param('tx_ref')),
    __param(1, Query('paymentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "verifyPayment", null);
__decorate([
    Get('payment-methods/:country'),
    ApiParam({ name: 'country', type: String, required: true }),
    __param(0, Param('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMgtController.prototype, "getPaymentMethods", null);
PaymentMgtController = __decorate([
    ApiTags('Payment Management'),
    UseGuards(AuthGuard, RoleGuard),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiBearerAuth('access-token'),
    Controller('/api/v1/payment-mgt'),
    __metadata("design:paramtypes", [PaymentMgtService])
], PaymentMgtController);
export { PaymentMgtController };
//# sourceMappingURL=payment-mgt.controller.js.map
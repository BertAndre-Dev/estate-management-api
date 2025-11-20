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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillPaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BillPaymentDto {
    billId;
    userId;
    walletId;
    frequency;
    amountPaid;
}
exports.BillPaymentDto = BillPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '6520b9c9d8f0f12f8a9a7f31',
        description: 'The ID of the bill being paid',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillPaymentDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '651fe8d1a1b2c3d4e5f67890',
        description: 'The ID of the user making the payment',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillPaymentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '651fe8d1a1b2c3d4e5f67890',
        description: 'The wallet ID of the user making the payment',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillPaymentDto.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'monthly',
        description: 'The chosen payment frequency (monthly, quarterly, yearly)',
        enum: ['monthly', 'quarterly', 'yearly'],
    }),
    (0, class_validator_1.IsEnum)(['monthly', 'quarterly', 'yearly']),
    __metadata("design:type", String)
], BillPaymentDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25000,
        description: 'Amount paid for this bill payment',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BillPaymentDto.prototype, "amountPaid", void 0);
//# sourceMappingURL=bill-payment.dto.js.map
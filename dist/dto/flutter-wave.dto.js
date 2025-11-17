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
exports.InitializePaymentDto = exports.CustomizationsDto = exports.CustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CustomerDto {
    email;
}
exports.CustomerDto = CustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'customer@example.com' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
class CustomizationsDto {
    title;
    description;
}
exports.CustomizationsDto = CustomizationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Payment Title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CustomizationsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Payment Description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CustomizationsDto.prototype, "description", void 0);
class InitializePaymentDto {
    tx_ref;
    amount;
    country;
    currency;
    redirect_url;
    payment_options;
    customer;
    customizations;
}
exports.InitializePaymentDto = InitializePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tx-63d1a147-a399-402e-918d-dd676b6c865c' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "tx_ref", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NG" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://your-app.com/redirect' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "redirect_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'card' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "payment_options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CustomerDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomerDto),
    __metadata("design:type", CustomerDto)
], InitializePaymentDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CustomizationsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomizationsDto),
    __metadata("design:type", CustomizationsDto)
], InitializePaymentDto.prototype, "customizations", void 0);
//# sourceMappingURL=flutter-wave.dto.js.map
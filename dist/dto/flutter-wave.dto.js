var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class CustomerDto {
    email;
}
__decorate([
    ApiProperty({ example: 'customer@example.com' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
export class CustomizationsDto {
    title;
    description;
}
__decorate([
    ApiProperty({ example: 'Payment Title' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CustomizationsDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ example: 'Payment Description' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CustomizationsDto.prototype, "description", void 0);
export class InitializePaymentDto {
    tx_ref;
    amount;
    country;
    currency;
    redirect_url;
    payment_options;
    customer;
    customizations;
}
__decorate([
    ApiProperty({ example: 'tx-63d1a147-a399-402e-918d-dd676b6c865c' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "tx_ref", void 0);
__decorate([
    ApiProperty({ example: 10 }),
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({ example: "NG" }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "country", void 0);
__decorate([
    ApiProperty({ example: 'NGN' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "currency", void 0);
__decorate([
    ApiProperty({ example: 'https://your-app.com/redirect' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "redirect_url", void 0);
__decorate([
    ApiProperty({ example: 'card' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "payment_options", void 0);
__decorate([
    ApiProperty({ type: CustomerDto }),
    ValidateNested(),
    Type(() => CustomerDto),
    __metadata("design:type", CustomerDto)
], InitializePaymentDto.prototype, "customer", void 0);
__decorate([
    ApiProperty({ type: CustomizationsDto }),
    ValidateNested(),
    Type(() => CustomizationsDto),
    __metadata("design:type", CustomizationsDto)
], InitializePaymentDto.prototype, "customizations", void 0);
//# sourceMappingURL=flutter-wave.dto.js.map
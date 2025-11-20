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
import { IsNotEmpty, IsString } from 'class-validator';
export class VerifyBillPaymentDto {
    tx_ref;
}
__decorate([
    ApiProperty({
        example: 'tx-bd492f12-90e2-4b7d-b72c-03ef6e0aa71e',
        description: 'The transaction reference (tx_ref) returned by Flutterwave',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], VerifyBillPaymentDto.prototype, "tx_ref", void 0);
//# sourceMappingURL=verify-payment.dto.js.map
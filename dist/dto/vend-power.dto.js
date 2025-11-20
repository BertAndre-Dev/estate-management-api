var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VendPowerDto {
    meterNumber;
    amount;
    walletId;
}
__decorate([
    ApiProperty({
        description: 'meter number',
        example: '233302022',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], VendPowerDto.prototype, "meterNumber", void 0);
__decorate([
    ApiProperty({
        description: 'amount to vend',
        example: 1000,
    }),
    IsNotEmpty(),
    IsNumber(),
    __metadata("design:type", Number)
], VendPowerDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        description: 'The wallet ID to which this transaction belongs',
        example: '64d3b91e793c420f841f2f1a',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], VendPowerDto.prototype, "walletId", void 0);
//# sourceMappingURL=vend-power.dto.js.map
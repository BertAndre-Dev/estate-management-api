var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateTransactionDto {
    walletId;
    type;
    amount;
    description;
    userId;
}
__decorate([
    ApiProperty({
        description: 'The wallet ID to which this transaction belongs',
        example: '64d3b91e793c420f841f2f1a',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "walletId", void 0);
__decorate([
    ApiProperty({
        description: 'Transaction type',
        enum: ['credit', 'debit'],
        example: 'credit',
    }),
    IsEnum(['credit', 'debit']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    ApiProperty({
        description: 'Transaction amount',
        example: 5000,
    }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Optional description or note about the transaction',
        example: 'Payment for premium plan',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'ID of the user performing this transaction',
        example: "690e0bb8f06f05175db9cd85"
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "userId", void 0);
//# sourceMappingURL=transaction.dto.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateWalletDto {
    userId;
    balance;
    lockedBalance;
}
__decorate([
    ApiProperty({
        description: 'The unique identifier of the user',
        example: '64ef1b2c3d4e5f67890a1234',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "userId", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'The available balance in the wallet',
        example: 0,
        default: 0,
    }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateWalletDto.prototype, "balance", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'The locked balance in the wallet (e.g., for pending transactions)',
        example: 0,
        default: 0,
    }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateWalletDto.prototype, "lockedBalance", void 0);
//# sourceMappingURL=wallet.dto.js.map
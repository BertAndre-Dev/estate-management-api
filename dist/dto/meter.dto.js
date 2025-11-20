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
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
export class MeterDto {
    meterNumber;
    userId;
    estateId;
    newEstateId;
    addressId;
}
__decorate([
    ApiProperty({
        example: '01123456789',
        description: 'Unique meter number assigned to the resident',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], MeterDto.prototype, "meterNumber", void 0);
__decorate([
    ApiProperty({
        example: '66a9d7a2b1f6c9e8d0a12345',
        description: 'User ID of the resident who owns this meter',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MeterDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'Estate ID where the meter is installed',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], MeterDto.prototype, "estateId", void 0);
__decorate([
    ApiProperty({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'Estate ID where the meter is to be re-assigned',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], MeterDto.prototype, "newEstateId", void 0);
__decorate([
    ApiProperty({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'The residents address id',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MeterDto.prototype, "addressId", void 0);
//# sourceMappingURL=meter.dto.js.map
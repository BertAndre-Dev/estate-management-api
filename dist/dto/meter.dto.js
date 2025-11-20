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
exports.MeterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MeterDto {
    meterNumber;
    userId;
    estateId;
    newEstateId;
    addressId;
}
exports.MeterDto = MeterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '01123456789',
        description: 'Unique meter number assigned to the resident',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MeterDto.prototype, "meterNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '66a9d7a2b1f6c9e8d0a12345',
        description: 'User ID of the resident who owns this meter',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MeterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'Estate ID where the meter is installed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MeterDto.prototype, "estateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'Estate ID where the meter is to be re-assigned',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MeterDto.prototype, "newEstateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64b83f3de2f2f2b6a1234567',
        description: 'The residents address id',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MeterDto.prototype, "addressId", void 0);
//# sourceMappingURL=meter.dto.js.map
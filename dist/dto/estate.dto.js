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
exports.EstateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EstateDto {
    name;
    address;
    city;
    state;
    country;
    isActive;
}
exports.EstateDto = EstateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the estate',
        example: 'Green Valley Estate',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Street address of the estate',
        example: '123 Palm Avenue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstateDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City where the estate is located',
        example: 'Lagos',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstateDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State where the estate is located',
        example: 'Lagos State',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstateDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country where the estate is located',
        example: 'Nigeria',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstateDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indicates if the estate is active',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EstateDto.prototype, "isActive", void 0);
//# sourceMappingURL=estate.dto.js.map
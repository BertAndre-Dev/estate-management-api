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
import { IsBoolean, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
export class EstateDto {
    name;
    address;
    city;
    state;
    country;
    isActive;
}
__decorate([
    ApiProperty({
        description: 'Name of the estate',
        example: 'Green Valley Estate',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], EstateDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        description: 'Street address of the estate',
        example: '123 Palm Avenue',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], EstateDto.prototype, "address", void 0);
__decorate([
    ApiProperty({
        description: 'City where the estate is located',
        example: 'Lagos',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], EstateDto.prototype, "city", void 0);
__decorate([
    ApiProperty({
        description: 'State where the estate is located',
        example: 'Lagos State',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], EstateDto.prototype, "state", void 0);
__decorate([
    ApiProperty({
        description: 'Country where the estate is located',
        example: 'Nigeria',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], EstateDto.prototype, "country", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Indicates if the estate is active',
        example: true,
        default: true,
    }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], EstateDto.prototype, "isActive", void 0);
//# sourceMappingURL=estate.dto.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ServiceChargeDto {
    estateId;
    amount;
    description;
}
__decorate([
    ApiProperty({
        description: 'The estate id',
        example: '64ef1b2c3d4e5f67890a1234',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ServiceChargeDto.prototype, "estateId", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'The amount for the service charge',
        example: 0,
        default: 0,
    }),
    IsNumber(),
    __metadata("design:type", Number)
], ServiceChargeDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        description: 'The description of what consist of the service charge',
        example: 'This consit of light, security etc',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ServiceChargeDto.prototype, "description", void 0);
//# sourceMappingURL=service-charge.dto.js.map
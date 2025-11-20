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
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateBillDto {
    estateId;
    name;
    description;
    yearlyAmount;
}
__decorate([
    ApiProperty({
        example: '65e8e8d2d1c4a3c1a2b9e8f4',
        description: 'Estate id for the bill being created for the estate',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "estateId", void 0);
__decorate([
    ApiProperty({
        example: 'Electricity',
        description: 'The name of the bill being created (e.g., Electricity, Service Charge)',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        example: 'Electricity service charge for all residents',
        description: 'A short description of the bill',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        example: 120000,
        description: 'The fixed yearly amount for the bill',
    }),
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "yearlyAmount", void 0);
//# sourceMappingURL=create-bill.dto.js.map
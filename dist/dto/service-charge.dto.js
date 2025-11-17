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
exports.ServiceChargeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ServiceChargeDto {
    estateId;
    amount;
    description;
}
exports.ServiceChargeDto = ServiceChargeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The estate id',
        example: '64ef1b2c3d4e5f67890a1234',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceChargeDto.prototype, "estateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The amount for the service charge',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ServiceChargeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of what consist of the service charge',
        example: 'This consit of light, security etc',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceChargeDto.prototype, "description", void 0);
//# sourceMappingURL=service-charge.dto.js.map
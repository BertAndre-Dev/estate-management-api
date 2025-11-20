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
import { IsNotEmpty, IsString } from 'class-validator';
export class FieldDto {
    label;
    key;
}
__decorate([
    ApiProperty({ example: 'Address Name' }),
    IsString(),
    __metadata("design:type", String)
], FieldDto.prototype, "label", void 0);
__decorate([
    ApiProperty({ example: 'Block/Unit' }),
    IsString(),
    __metadata("design:type", String)
], FieldDto.prototype, "key", void 0);
export class CreateFieldDto {
    estateId;
    label;
    key;
}
__decorate([
    ApiProperty({ example: '65e8e8d2d1c4a3c1a2b9e8f4' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateFieldDto.prototype, "estateId", void 0);
__decorate([
    ApiProperty({ example: 'Address Name' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateFieldDto.prototype, "label", void 0);
__decorate([
    ApiProperty({ example: 'Block/Unit' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateFieldDto.prototype, "key", void 0);
//# sourceMappingURL=field.dto.js.map
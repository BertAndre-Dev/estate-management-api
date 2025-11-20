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
import { IsNotEmpty, IsString, IsObject } from 'class-validator';
export class CreateEntryDto {
    estateId;
    fieldId;
    data;
}
__decorate([
    ApiProperty({
        description: 'The ID of the estate this entry belongs to',
        example: '6712ab0cdef4567890abcd12',
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateEntryDto.prototype, "estateId", void 0);
__decorate([
    ApiProperty({
        description: 'The ID of the address field associated with this entry',
        example: '672bcf789def123456abcd90',
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateEntryDto.prototype, "fieldId", void 0);
__decorate([
    ApiProperty({
        description: 'The dynamic data for the entry, stored as key-value pairs',
        example: {
            houseNumber: 'A12',
            street: 'Maple Avenue',
            block: 'B',
            landmark: 'Near Central Park',
        },
    }),
    IsNotEmpty(),
    IsObject(),
    __metadata("design:type", Object)
], CreateEntryDto.prototype, "data", void 0);
//# sourceMappingURL=entry.dto.js.map
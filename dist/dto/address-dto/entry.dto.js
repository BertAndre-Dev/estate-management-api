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
exports.CreateEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEntryDto {
    estateId;
    fieldId;
    data;
}
exports.CreateEntryDto = CreateEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the estate this entry belongs to',
        example: '6712ab0cdef4567890abcd12',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEntryDto.prototype, "estateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the address field associated with this entry',
        example: '672bcf789def123456abcd90',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEntryDto.prototype, "fieldId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The dynamic data for the entry, stored as key-value pairs',
        example: {
            houseNumber: 'A12',
            street: 'Maple Avenue',
            block: 'B',
            landmark: 'Near Central Park',
        },
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateEntryDto.prototype, "data", void 0);
//# sourceMappingURL=entry.dto.js.map
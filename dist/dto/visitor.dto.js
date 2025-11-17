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
exports.VisitorDto = exports.VisitorDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class VisitorDetailsDto {
    firstName;
    lastName;
    purpose;
}
exports.VisitorDetailsDto = VisitorDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sodiq',
        description: 'Visitor first name'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Abbass',
        description: 'Visitor last name'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Came to make a delivery',
        description: 'purpose of visit'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "purpose", void 0);
class VisitorDto {
    visitor;
    residentId;
    addressId;
}
exports.VisitorDto = VisitorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "List of visitors",
        type: [VisitorDetailsDto],
        example: [
            {
                firstName: "Sodiq",
                lastName: "Abbass",
                purpose: "To make a delivery"
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VisitorDetailsDto),
    __metadata("design:type", Array)
], VisitorDto.prototype, "visitor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Resident ID",
        example: "6712ab0cdef4567890abcd12"
    }),
    __metadata("design:type", String)
], VisitorDto.prototype, "residentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Resident address ID",
        example: "6712ab0cdef4567890abcd12"
    }),
    __metadata("design:type", String)
], VisitorDto.prototype, "addressId", void 0);
//# sourceMappingURL=visitor.dto.js.map
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
import { IsArray, IsNotEmpty, IsString, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class VisitorDetailsDto {
    firstName;
    lastName;
    purpose;
}
__decorate([
    ApiProperty({
        example: 'Sodiq',
        description: 'Visitor first name'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({
        example: 'Abbass',
        description: 'Visitor last name'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({
        example: 'Came to make a delivery',
        description: 'purpose of visit'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], VisitorDetailsDto.prototype, "purpose", void 0);
export class VisitorDto {
    visitor;
    residentId;
    addressId;
}
__decorate([
    ApiProperty({
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
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => VisitorDetailsDto),
    __metadata("design:type", Array)
], VisitorDto.prototype, "visitor", void 0);
__decorate([
    ApiProperty({
        description: "Resident ID",
        example: "6712ab0cdef4567890abcd12"
    }),
    __metadata("design:type", String)
], VisitorDto.prototype, "residentId", void 0);
__decorate([
    ApiProperty({
        description: "Resident address ID",
        example: "6712ab0cdef4567890abcd12"
    }),
    __metadata("design:type", String)
], VisitorDto.prototype, "addressId", void 0);
//# sourceMappingURL=visitor.dto.js.map
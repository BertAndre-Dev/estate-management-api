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
import { MaxLength, MinLength, IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { Role } from "../../common/enum/roles.enum";
export class UpdateUserDto {
    firstName;
    lastName;
    email;
    countryCode;
    dateOfBirth;
    gender;
    phoneNumber;
    address;
    role;
    image;
}
__decorate([
    ApiProperty({
        example: "Bill",
        description: "User first name"
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(2),
    MaxLength(20),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({
        example: "Tola",
        description: "User last name"
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(2),
    MaxLength(20),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({
        example: "user@email.com",
        description: "User email"
    }),
    IsString(),
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    ApiProperty({
        example: '+234',
        description: 'User country code',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "countryCode", void 0);
__decorate([
    ApiProperty({
        example: '2025-03-01',
        description: 'User date of birth',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    ApiProperty({
        example: 'male | female',
        description: 'User gender',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    ApiProperty({
        example: '8100001427',
        description: 'User phone number',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    ApiProperty({
        example: 'apartment 4, blk 1',
        description: 'User phone number',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    ApiProperty({
        example: 'Resident',
        description: 'Role of the user',
        enum: Role,
        default: Role.RESIDENT,
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        description: 'Base64-encoded user profile image',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "image", void 0);
//# sourceMappingURL=update-user.dto.js.map
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
import { Matches, MaxLength, MinLength, IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { Role } from "../../common/enum/roles.enum";
export class CreateUserDto {
    firstName;
    lastName;
    email;
    countryCode;
    dateOfBirth;
    gender;
    phoneNumber;
    address;
    pin;
    role;
    password;
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
], CreateUserDto.prototype, "firstName", void 0);
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
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({
        example: "user@email.com",
        description: "User email"
    }),
    IsString(),
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    ApiProperty({
        example: '+234',
        description: 'User country code',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "countryCode", void 0);
__decorate([
    ApiProperty({
        example: '2025-03-01',
        description: 'User date of birth',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    ApiProperty({
        example: 'male | female',
        description: 'User gender',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
__decorate([
    ApiProperty({
        example: '8100001427',
        description: 'User phone number',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    ApiProperty({
        example: 'apartment 4, blk 1',
        description: 'User phone number',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    ApiProperty({
        example: 100098,
        description: 'Resident mobile app login pin',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "pin", void 0);
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
], CreateUserDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        example: 'password123',
        description: 'Password for the user account',
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." }),
    MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        description: 'Base64-encoded user profile image',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "image", void 0);
//# sourceMappingURL=create-user.dto.js.map
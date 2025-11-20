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
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from "../../common/enum/roles.enum";
export class InviteUserDto {
    estateId;
    firstName;
    lastName;
    addressId;
    role;
    email;
}
__decorate([
    ApiProperty({
        example: '65e8e8d2d1c4a3c1a2b9e8f4',
        description: 'User estate id'
    }),
    IsString(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "estateId", void 0);
__decorate([
    ApiProperty({
        example: 'Tola',
        description: 'Resident first name'
    }),
    IsString(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({
        example: 'Bola',
        description: 'residents last name'
    }),
    IsString(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({
        example: '65e8e8d2d1c4a3c1a2b9e8f4',
        description: 'User estate address id'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "addressId", void 0);
__decorate([
    ApiProperty({
        example: 'member',
        description: 'Role of the member',
        enum: Role,
        default: Role.ADMIN,
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        example: 'user@email.com',
        description: 'User Email'
    }),
    IsEmail(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "email", void 0);
//# sourceMappingURL=invite-user.dto.js.map
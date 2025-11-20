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
import { Matches, MaxLength, MinLength, IsNotEmpty, IsString, } from 'class-validator';
export class UpdatePasswordDto {
    currentPassword;
    newPassword;
}
__decorate([
    ApiProperty({
        example: 'password123',
        description: 'Current password for the user account',
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." }),
    MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    }),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    ApiProperty({
        example: 'password123',
        description: 'New password for the user account',
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." }),
    MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    }),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=update-password.dto.js.map
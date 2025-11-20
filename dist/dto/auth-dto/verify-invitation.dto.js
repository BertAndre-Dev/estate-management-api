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
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class VerifyInvitationDto {
    email;
    tempPassword;
    newPassword;
}
__decorate([
    ApiProperty({
        example: 'user@example.com',
        description: 'The email address associated with the invited account.',
    }),
    IsEmail({}, { message: 'A valid email address is required.' }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "email", void 0);
__decorate([
    ApiProperty({
        example: 'Temp@123',
        description: 'The temporary password that was sent to the user during invitation.',
    }),
    IsNotEmpty({ message: 'Temporary password is required.' }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "tempPassword", void 0);
__decorate([
    ApiProperty({
        example: 'StrongPassword@2025',
        description: 'The new password the user wants to set. Must contain uppercase, lowercase, number, and special character.',
    }),
    IsNotEmpty({ message: 'New password is required.' }),
    MinLength(8, { message: 'Password must be at least 8 characters long.' }),
    Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/, {
        message: 'Password must contain uppercase, lowercase, number, and special character.',
    }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "newPassword", void 0);
//# sourceMappingURL=verify-invitation.dto.js.map
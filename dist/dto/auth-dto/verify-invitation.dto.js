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
exports.VerifyInvitationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyInvitationDto {
    email;
    tempPassword;
    newPassword;
}
exports.VerifyInvitationDto = VerifyInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email address associated with the invited account.',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'A valid email address is required.' }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Temp@123',
        description: 'The temporary password that was sent to the user during invitation.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Temporary password is required.' }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "tempPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'StrongPassword@2025',
        description: 'The new password the user wants to set. Must contain uppercase, lowercase, number, and special character.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required.' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long.' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/, {
        message: 'Password must contain uppercase, lowercase, number, and special character.',
    }),
    __metadata("design:type", String)
], VerifyInvitationDto.prototype, "newPassword", void 0);
//# sourceMappingURL=verify-invitation.dto.js.map
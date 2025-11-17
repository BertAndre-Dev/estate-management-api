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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_mgt_service_1 = require("./auth-mgt.service");
const resend_otp_dto_1 = require("../../dto/auth-dto/resend-otp.dto");
const reset_password_dto_1 = require("../../dto/auth-dto/reset-password.dto");
const sign_in_dto_1 = require("../../dto/auth-dto/sign-in.dto");
const verify_otp_dto_1 = require("../../dto/auth-dto/verify-otp.dto");
const forgot_password_dto_1 = require("../../dto/auth-dto/forgot-password.dto");
const refresh_token_dto_1 = require("../../dto/auth-dto/refresh-token.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_user_dto_1 = require("../../dto/user-dto/create-user.dto");
const invite_user_dto_1 = require("../../dto/auth-dto/invite-user.dto");
const roles_enum_1 = require("../../common/enum/roles.enum");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const pin_login_dto_1 = require("../../dto/auth-dto/pin-login.dto");
const verify_invitation_dto_1 = require("../../dto/auth-dto/verify-invitation.dto");
let AuthMgtController = class AuthMgtController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async SignUp(dto) {
        try {
            return await this.authService.signUp(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async inviteUser(dto) {
        try {
            return this.authService.inviteUser(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyInvitedUser(dto) {
        try {
            return this.authService.verifyInvitation(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async signIn(dto, res) {
        try {
            return await this.authService.signIn(dto, res);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async pinLogin(dto, res) {
        try {
            return await this.authService.pinLogin(dto.email, dto.pin, res);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async signOut(email, res) {
        try {
            const result = await this.authService.signOut(email, res);
            return res.json(result);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async refreshToken(dto, req, res) {
        try {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                throw new common_1.ForbiddenException('No refresh token found in cookies.');
            }
            const tokens = await this.authService.refreshTokens(dto.email, refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return {
                message: 'Token refreshed successfully',
                accessToken: tokens.accessToken,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyOtp(dto) {
        try {
            if (!dto.email || !dto.otp) {
                throw new common_1.BadRequestException('Email and otp are required.');
            }
            return await this.authService.verifyOtp(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resendOtp(dto) {
        try {
            if (!dto.email) {
                throw new common_1.BadRequestException('Email is required');
            }
            return await this.authService.resendOtp(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async forgotPassword(dto) {
        try {
            if (!dto.email)
                throw new common_1.BadRequestException('Email is required');
            return await this.authService.forgotPassword(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resetPassword(dto) {
        try {
            return await this.authService.resetPassword(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getSignedInUser(req) {
        try {
            const userId = req.user?.id;
            return this.authService.getUserById(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AuthMgtController = AuthMgtController;
__decorate([
    (0, common_1.Post)('sign-up'),
    (0, swagger_1.ApiOperation)({
        summary: 'user sign up',
        description: 'This API is for signing up of the user.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "SignUp", null);
__decorate([
    (0, common_1.Post)('invite-user'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Invite user to sign up',
        description: 'This API invites a user by the super admin to sign up.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "inviteUser", null);
__decorate([
    (0, common_1.Post)('verify-invited-user'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify invited user to sign up',
        description: 'This API verifies an invited user.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_invitation_dto_1.VerifyInvitationDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "verifyInvitedUser", null);
__decorate([
    (0, common_1.Post)('sign-in'),
    (0, swagger_1.ApiOperation)({
        summary: 'User sign in',
        description: 'This API handles all user sign in'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('pin-login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Researcher user pin login',
        description: 'This API is for logging in the researcher user using pin.'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pin_login_dto_1.PinLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "pinLogin", null);
__decorate([
    (0, common_1.Post)('sign-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "signOut", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh user tokens',
        description: 'Refreshes users access token upon expirations'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'all verify OTP',
        description: 'This API handle all user OTP verification'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'all resend otp',
        description: 'This API handles resending of OTP to the all user'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Forgot password',
        description: 'Request a password reset code to be sent to your email.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password',
        description: 'Reset your password using the reset code sent to your email.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'This API returns the signed in user',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "getSignedInUser", null);
exports.AuthMgtController = AuthMgtController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('/api/v1/auth-mgt'),
    __metadata("design:paramtypes", [auth_mgt_service_1.AuthMgtService])
], AuthMgtController);
//# sourceMappingURL=auth-mgt.controller.js.map
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
import { Controller, Body, Post, BadRequestException, UseGuards, Req, Get, Res, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthMgtService } from './auth-mgt.service';
import { ResendOtpDto } from "../../dto/auth-dto/resend-otp.dto";
import { ResetPasswordDto } from "../../dto/auth-dto/reset-password.dto";
import { SignInDto } from "../../dto/auth-dto/sign-in.dto";
import { VerifyOtpDto } from "../../dto/auth-dto/verify-otp.dto";
import { ForgotPasswordDto } from "../../dto/auth-dto/forgot-password.dto";
import { RefreshTokenDto } from "../../dto/auth-dto/refresh-token.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { CreateUserDto } from "../../dto/user-dto/create-user.dto";
import { InviteUserDto } from "../../dto/auth-dto/invite-user.dto";
import { Role } from "../../common/enum/roles.enum";
import { Roles } from "../../common/decorators/roles.decorstor";
import { PinLoginDto } from "../../dto/auth-dto/pin-login.dto";
import { VerifyInvitationDto } from "../../dto/auth-dto/verify-invitation.dto";
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
            throw new BadRequestException(error.message);
        }
    }
    async inviteUser(dto) {
        try {
            return this.authService.inviteUser(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async verifyInvitedUser(dto) {
        try {
            return this.authService.verifyInvitation(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async signIn(dto, res) {
        try {
            return await this.authService.signIn(dto, res);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async pinLogin(dto, res) {
        try {
            return await this.authService.pinLogin(dto.email, dto.pin, res);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async signOut(email, res) {
        try {
            const result = await this.authService.signOut(email, res);
            return res.json(result);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async refreshToken(dto, req, res) {
        try {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                throw new ForbiddenException('No refresh token found in cookies.');
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
            throw new BadRequestException(error.message);
        }
    }
    async verifyOtp(dto) {
        try {
            if (!dto.email || !dto.otp) {
                throw new BadRequestException('Email and otp are required.');
            }
            return await this.authService.verifyOtp(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async resendOtp(dto) {
        try {
            if (!dto.email) {
                throw new BadRequestException('Email is required');
            }
            return await this.authService.resendOtp(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async forgotPassword(dto) {
        try {
            if (!dto.email)
                throw new BadRequestException('Email is required');
            return await this.authService.forgotPassword(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async resetPassword(dto) {
        try {
            return await this.authService.resetPassword(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getSignedInUser(req) {
        try {
            const userId = req.user?.id;
            return this.authService.getUserById(userId);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post('sign-up'),
    ApiOperation({
        summary: 'user sign up',
        description: 'This API is for signing up of the user.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "SignUp", null);
__decorate([
    Post('invite-user'),
    UseGuards(AuthGuard, RoleGuard),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Invite user to sign up',
        description: 'This API invites a user by the super admin to sign up.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InviteUserDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "inviteUser", null);
__decorate([
    Post('verify-invited-user'),
    UseGuards(AuthGuard, RoleGuard),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Verify invited user to sign up',
        description: 'This API verifies an invited user.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyInvitationDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "verifyInvitedUser", null);
__decorate([
    Post('sign-in'),
    ApiOperation({
        summary: 'User sign in',
        description: 'This API handles all user sign in'
    }),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "signIn", null);
__decorate([
    Post('pin-login'),
    ApiOperation({
        summary: 'Researcher user pin login',
        description: 'This API is for logging in the researcher user using pin.'
    }),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PinLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "pinLogin", null);
__decorate([
    Post('sign-out'),
    HttpCode(HttpStatus.OK),
    __param(0, Body('email')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "signOut", null);
__decorate([
    Post('refresh-token'),
    ApiOperation({
        summary: 'Refresh user tokens',
        description: 'Refreshes users access token upon expirations'
    }),
    __param(0, Body()),
    __param(1, Req()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "refreshToken", null);
__decorate([
    Post('verify-otp'),
    ApiOperation({
        summary: 'all verify OTP',
        description: 'This API handle all user OTP verification'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "verifyOtp", null);
__decorate([
    Post('resend-otp'),
    ApiOperation({
        summary: 'all resend otp',
        description: 'This API handles resending of OTP to the all user'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "resendOtp", null);
__decorate([
    Post('forgot-password'),
    ApiOperation({
        summary: 'Forgot password',
        description: 'Request a password reset code to be sent to your email.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "forgotPassword", null);
__decorate([
    Post('reset-password'),
    ApiOperation({
        summary: 'Reset password',
        description: 'Reset your password using the reset code sent to your email.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "resetPassword", null);
__decorate([
    UseGuards(AuthGuard),
    Get('me'),
    ApiOperation({
        summary: 'This API returns the signed in user',
    }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthMgtController.prototype, "getSignedInUser", null);
AuthMgtController = __decorate([
    ApiTags('Authentication'),
    ApiBearerAuth('access-token'),
    Controller('/api/v1/auth-mgt'),
    __metadata("design:paramtypes", [AuthMgtService])
], AuthMgtController);
export { AuthMgtController };
//# sourceMappingURL=auth-mgt.controller.js.map
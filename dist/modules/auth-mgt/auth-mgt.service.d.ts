import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ResendOtpDto } from 'src/dto/auth-dto/resend-otp.dto';
import { InviteUserDto } from 'src/dto/auth-dto/invite-user.dto';
import { ForgotPasswordDto } from 'src/dto/auth-dto/forgot-password.dto';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { ResetPasswordDto } from 'src/dto/auth-dto/reset-password.dto';
import { SignInDto } from 'src/dto/auth-dto/sign-in.dto';
import { VerifyOtpDto } from 'src/dto/auth-dto/verify-otp.dto';
import { VerifyInvitationDto } from 'src/dto/auth-dto/verify-invitation.dto';
import { WalletMgtService } from '../wallet-mgt/wallet-mgt.service';
export declare class AuthMgtService {
    private userModel;
    private jwt;
    private config;
    private cloudinary;
    private wallet;
    constructor(userModel: Model<UserDocument>, jwt: JwtService, config: ConfigService, cloudinary: CloudinaryService, wallet: WalletMgtService);
    signUp(dto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendOtp(email: string, otp?: string, firstName?: string, lastName?: string): Promise<void>;
    signIn(dto: SignInDto, res: Response): Promise<{
        message: string;
        data: any;
        accessToken: string;
    }>;
    pinLogin(email: string, pin: string, res: Response): Promise<{
        message: string;
        data: any;
        accessToken: string;
    }>;
    inviteUser(dto: InviteUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyInvitation(dto: VerifyInvitationDto): Promise<{
        success: boolean;
        message: string;
    }>;
    completeSignup(token: string, dto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    refreshTokens(email: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(email: string, refreshToken: string): Promise<void>;
    private generateToken;
    private generateStrongPassword;
    getUserById(userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    signOut(email: string, res: Response): Promise<{
        message: string;
    }>;
}

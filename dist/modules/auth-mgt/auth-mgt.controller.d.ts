import { AuthMgtService } from './auth-mgt.service';
import { ResendOtpDto } from 'src/dto/auth-dto/resend-otp.dto';
import { ResetPasswordDto } from 'src/dto/auth-dto/reset-password.dto';
import { SignInDto } from 'src/dto/auth-dto/sign-in.dto';
import { VerifyOtpDto } from 'src/dto/auth-dto/verify-otp.dto';
import { ForgotPasswordDto } from 'src/dto/auth-dto/forgot-password.dto';
import { RefreshTokenDto } from 'src/dto/auth-dto/refresh-token.dto';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';
import { InviteUserDto } from 'src/dto/auth-dto/invite-user.dto';
import { PinLoginDto } from 'src/dto/auth-dto/pin-login.dto';
import { VerifyInvitationDto } from 'src/dto/auth-dto/verify-invitation.dto';
export declare class AuthMgtController {
    private readonly authService;
    constructor(authService: AuthMgtService);
    SignUp(dto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    inviteUser(dto: InviteUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyInvitedUser(dto: VerifyInvitationDto): Promise<{
        success: boolean;
        message: string;
    }>;
    signIn(dto: SignInDto, res: Response): Promise<{
        message: string;
        data: any;
        accessToken: string;
    }>;
    pinLogin(dto: PinLoginDto, res: Response): Promise<{
        message: string;
        data: any;
        accessToken: string;
    }>;
    signOut(email: string, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(dto: RefreshTokenDto, req: Request, res: Response): Promise<{
        message: string;
        accessToken: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getSignedInUser(req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}

import { 
    Controller,
    Body,
    Post,
    BadRequestException,
    UseGuards,
    Req,
    Get,
    Res,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Query
} from '@nestjs/common';
import { 
    ApiTags, 
    ApiOperation,
    ApiBearerAuth
} from '@nestjs/swagger';
import { AuthMgtService } from './auth-mgt.service';
import { ResendOtpDto } from 'src/dto/auth-dto/resend-otp.dto';
import { ResetPasswordDto } from 'src/dto/auth-dto/reset-password.dto';
import { SignInDto } from 'src/dto/auth-dto/sign-in.dto';
import { VerifyOtpDto } from 'src/dto/auth-dto/verify-otp.dto';
import { ForgotPasswordDto } from 'src/dto/auth-dto/forgot-password.dto';
import { RefreshTokenDto } from 'src/dto/auth-dto/refresh-token.dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';
import { InviteUserDto } from 'src/dto/auth-dto/invite-user.dto';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { PinLoginDto } from 'src/dto/auth-dto/pin-login.dto';
import { VerifyInvitationDto } from 'src/dto/auth-dto/verify-invitation.dto';


@ApiTags('Authentication')
@ApiBearerAuth('access-token')
@Controller('/api/v1/auth-mgt')
export class AuthMgtController {
    constructor(
        private readonly authService: AuthMgtService
    ){}


    // sign up
    @Post('sign-up')
    @ApiOperation({ 
        summary: 'user sign up',
        description: 'This API is for signing up of the user.'
    })
    async SignUp(
        @Body() dto: CreateUserDto,
    ) {
        try {
            return await this.authService.signUp(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    // invite user
    @Post('invite-user')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Invite user to sign up',
        description: 'This API invites a user by the super admin to sign up.'
    })
    async inviteUser(
        @Body() dto: InviteUserDto, 
    ) {
        try {
            return this.authService.inviteUser(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Post('verify-invited-user')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Verify invited user to sign up',
        description: 'This API verifies an invited user.'
    })
    async verifyInvitedUser(
        @Body() dto: VerifyInvitationDto, 
    ) {
        try {
            return this.authService.verifyInvitation(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // complete invited user sign up
    // @Post('complete-signup')
    // @ApiOperation({
    //     summary: 'Complete invited user sign up',
    //     description: 'This api completes the invited users sign up.'
    // })
    // async completeSignup(
    //     @Query('token') token: string, 
    //     @Body() dto: CreateUserDto
    // ) {
    //     try {
    //         return this.authService.completeSignup(token, dto);
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // Sign in 
    @Post('sign-in')
    @ApiOperation({
        summary: 'User sign in',
        description: 'This API handles all user sign in'
    })
    async signIn(
        @Body() dto: SignInDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            return await this.authService.signIn(dto, res);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // pin login 
    @Post('pin-login')
    @ApiOperation({
        summary: 'Researcher user pin login',
        description: 'This API is for logging in the researcher user using pin.'
    })
    async pinLogin(
        @Body() dto: PinLoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            return await this.authService.pinLogin(dto.email, dto.pin, res);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    

    // sign out
    @Post('sign-out')
    @HttpCode(HttpStatus.OK)
    async signOut(
        @Body('email') email: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.authService.signOut(email, res);
            return res.json(result);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Post('refresh-token')
    @ApiOperation({ 
        summary: 'Refresh user tokens',
        description: 'Refreshes users access token upon expirations'
    })
    async refreshToken(
        @Body() dto: RefreshTokenDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const refreshToken = req.cookies['refreshToken'];

            if (!refreshToken) {
                throw new ForbiddenException('No refresh token found in cookies.');
            }

            const tokens = await this.authService.refreshTokens(dto.email, refreshToken);

            // Optionally re-set the cookie with the new refreshToken
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return {
                message: 'Token refreshed successfully',
                accessToken: tokens.accessToken,
            };
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }


    // verify email
    @Post('verify-otp')
    @ApiOperation({
        summary: 'all verify OTP',
        description: 'This API handle all user OTP verification'
    })
    async verifyOtp(
        @Body() dto: VerifyOtpDto
    ) {
        try {
            if (!dto.email || !dto.otp) {
                throw new BadRequestException('Email and otp are required.');
            }

            return await this.authService.verifyOtp(dto)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }


    // resend otp
    @Post('resend-otp')
    @ApiOperation({
        summary: 'all resend otp',
        description: 'This API handles resending of OTP to the all user'
    })
    async resendOtp(
        @Body() dto: ResendOtpDto
    ) {
        try {
            if (!dto.email) {
                throw new BadRequestException('Email is required');
            }

            return await this.authService.resendOtp(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // forgot password
    @Post('forgot-password')
    @ApiOperation({
    summary: 'Forgot password',
    description: 'Request a password reset code to be sent to your email.'
    })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        try {
            if (!dto.email) throw new BadRequestException('Email is required');
            return await this.authService.forgotPassword(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // reset password
    @Post('reset-password')
    @ApiOperation({
    summary: 'Reset password',
    description: 'Reset your password using the reset code sent to your email.'
    })
    async resetPassword(
        @Body() dto: ResetPasswordDto
    ) {
        try {
            return await this.authService.resetPassword(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @UseGuards(AuthGuard)
    @Get('me')
    @ApiOperation({
        summary: 'This API returns the signed in user',
    })
    async getSignedInUser(@Req() req) {
        try {
            const userId = req.user?.id;
            return this.authService.getUserById(userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


}

import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { toResponseObject } from 'src/common/utils/transform.util';
import { Role } from 'src/common/enum/roles.enum';
import { ConfigService } from '@nestjs/config';
import * as Nodemailer from "nodemailer";
import * as argon from "argon2";
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




@Injectable()
export class AuthMgtService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwt: JwtService,
        private config: ConfigService,
        private cloudinary: CloudinaryService,
        private wallet: WalletMgtService,
    ){}


    // Sign up
    async signUp(dto: CreateUserDto) {
        // Normalize email
        const normalizeEmail = dto.email.toLowerCase().trim();

        // Check if email exists
        const exist = await this.userModel.findOne({
            email: normalizeEmail
        });

        if (exist) {
            throw new ConflictException("User with this email already exist.");
        }

        // Handle image 
        let imageUrl: string | undefined;

        if (dto.image) {
            if (!dto.image.startsWith("data:image/")) {
                throw new BadRequestException("Invalid image. Image must be a base64-encoded");
            }

            try {
                const publicId = `user_profiles/${Date.now()}`;
                const uploadResponse = await this.cloudinary.uploadImage(dto.image, publicId);
                imageUrl = uploadResponse.secure_url;
            } catch (error) {
                throw new BadRequestException(error.message);
            }
        }

        // Hash password
        const hash = await argon.hash(dto.password);

        // Generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

        // Create user
        const user = new this.userModel({
            ...dto,
            email: normalizeEmail,
            hash,
            otp,
            otpExpiresAt,
            image: imageUrl
        });

        try {
            const savedUser = await user.save();

            try {
                await this.sendOtp(
                    savedUser.email,
                    otp,
                    savedUser.firstName ?? "",
                    savedUser.lastName ?? ""
                );

                return {
                    success: true,
                    message: "Sign up successful. Please verify your account with the OTP sent to your email."
                };
            } catch (error) {
                // Don’t delete user — just log and notify
                console.error("Failed to send OTP:", error.message);

                return {
                success: true,
                message: "Account created successfully, but we couldn't send your verification OTP. Please request a new OTP from the login screen."
                };
            }
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException("User with this email already exist.");
            }
            throw new BadRequestException(error.message);
        }

    }


    // Send OTP to user
    async sendOtp(email: string, otp?: string, firstName?: string, lastName?: string) {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const user = await this.userModel.findOne({email: normalizedEmail});

        if (!user) throw new NotFoundException('User not found.');
     
        const transporter = Nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS
            auth: {
                user: this.config.get('EMAIL_USER'),
                pass: this.config.get('EMAIL_PASS'),
            },
        });


        const mailOptions = {
            from: this.config.get('EMAIL_USER'),
            to: email,
            subject: 'OTP Verification',
            text: `Dear ${firstName} ${lastName}, Your OTP is ${otp}. It is valid for 10 minutes.`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Sign in
    async signIn(dto: SignInDto, res: Response) {
        try {
            // convert email to lowercase
            const normalizedEmail = dto.email.toLowerCase().trim();
    
            // check if the user exist
            const user = await this.userModel.findOne({ email: normalizedEmail });
    
            if (!user) {
                throw new NotFoundException('User not found.');
            }
    
            // check if account is locked
            if (user.lockUntil && user.lockUntil > new Date()) {
                throw new UnauthorizedException(
                    `Account is locked. Try again after ${user.lockUntil.toLocaleTimeString()}.`
                )
            } 
            
            // check if the user is verified
            if (!user.isVerified) {
                throw new UnauthorizedException("user is not verified");
            }
    
            // check if password matches
            const isPasswordCorrect = await import('argon2').then(argon2 => argon2.verify(user.hash, dto.password));
    
            if (!isPasswordCorrect) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    
                // lock account after 3 failed attempts for 30 minutes
                if (user.failedLoginAttempts >= 3) {
                    user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
                    await user.save();
                    throw new UnauthorizedException('Account locked due to too many failed login attempts. Try again after 30 minutes.');
                }
    
                await user.save();
                throw new UnauthorizedException('Invalid password.');
            }
    
    
            // generate access token
            const payload = {
                sub: (user._id as any).toString(), 
                email: user.email,
                role: user.role
            };
    
            const tokens = await this.generateToken(payload);
            await this.updateRefreshToken(user.email, tokens.refreshToken);
    
            // set refresh token as HttpOnly cookie
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/authentication/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
    
            return {
                message: 'Signed in successfully',
                data: toResponseObject(user),
                accessToken: tokens.accessToken
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Pin login
    async pinLogin(email: string, pin: string, res: Response) {
        try {
            const user = await this.userModel.findOne({ email });

            // Check if user exist
            if (!user) {
                throw new BadRequestException("User does not exist.");
            }

            // Check if the account is locked
            if (user.lockUntil && user.lockUntil > new Date()) {
                throw new UnauthorizedException(
                    `Account is locked. Try again after ${user.lockUntil.toLocaleTimeString()}`
                );
            }

            // Check if the user is verified
            if (!user.isVerified) {
                throw new UnauthorizedException(`Account is not verified.`);
            }


            // Verify pin 
            const isPinValid = await argon.verify(user.pinHash, pin);

            if (!isPinValid) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

                // Lock account after 3 failed attempts for 30 minutes
                if (user.failedLoginAttempts >= 3) {
                    user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);

                    await user.save();

                    throw new UnauthorizedException("Account has been locked due to too many failed login attempts. Try again after 30 minutes.");
                }

                await user.save();

                throw new UnauthorizedException("Invalid Pin");
            }


            // Reset failed attempts and lockUntil on the successful login 
            user.failedLoginAttempts = 0;
            user.lockUntil = undefined;

            await user.save();


            // generate access token
            const payload = {
                sub: (user._id as any).toString(), 
                email: user.email,
                role: user.role
            };

            const tokens = await this.generateToken(payload);
            await this.updateRefreshToken(user.email, tokens.refreshToken);

            // set refresh token as HttpOnly cookie
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/authentication/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return {
                message: 'Signed in successfully',
                data: toResponseObject(user),
                accessToken: tokens.accessToken
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // invite user via temporary password (for all roles)
    async inviteUser(dto: InviteUserDto) {
        try {
            const { estateId, email, role, addressId, firstName, lastName } = dto;

            const normalizedEmail = email.toLowerCase().trim();

            // 🔹 Check for existing user
            const existingUser = await this.userModel.findOne({ email: normalizedEmail });
            if (existingUser) {
            throw new ConflictException('User with this email already exists');
            }

            // 🔹 Address validation for residents
            if (role === 'resident') {
                if (!addressId) {
                    throw new BadRequestException('Address ID is required for residents.');
                }

                // ✅ NEW: Check if this address is already assigned to another resident
                const addressInUse = await this.userModel.findOne({
                    estateId,
                    addressId,
                    role: 'resident',
                });

                if (addressInUse) {
                    throw new ConflictException('This address has already been assigned to a resident.');
                }
            }

            // 🔹 Generate and encode a strong temporary password
            const tempPassword = this.generateStrongPassword();
            const hashedPassword = await argon.hash(tempPassword);

            // 🔹 Create user with temporary password
            const user = await this.userModel.create({
                firstName,
                lastName,
                email: normalizedEmail,
                estateId,
                role,
                hash: hashedPassword,
                addressId,
                invitationStatus: 'not completed',
                isVerified: false,
                isActive: true,
            });

            // 🔹 Configure transporter
            const transporter = Nodemailer.createTransport({
                // host: 'mail.bertandreconsulting.com',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: this.config.get('EMAIL_USER'),
                    pass: this.config.get('EMAIL_PASS'),
                },
            });



            let emailBody = `Hello ${firstName} ${lastName},

        Your account for the estate portal has been created successfully.
        `;

            // ✅ Admins get only encoded secure link
            if (role.toLowerCase() === 'admin') {
            const baseUrl =
                this.config.get<string>('VERIFY_INVITE_URL') ||
                process.env.VERIFY_INVITE_URL;

            if (!baseUrl) {
                throw new Error('VERIFY_INVITE_URL is not defined in the environment');
            }

            // 🔹 Token with encoded tempPassword
            const token = this.jwt.sign(
                {
                userId: (user._id as any).toString(),
                email: normalizedEmail,
                tempPassword, // store encoded version
                },
                {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '7d',
                },
            );

            const encodedToken = encodeURIComponent(token);
            const signupLink = `${baseUrl}?token=${encodedToken}`;

            emailBody += `
        A secure link has been generated for you to verify and complete your setup.
        Click the link below (valid for 7 days):

        ${signupLink}

        If you didn’t request this, you can ignore this email.
        `;

            } else {
            // ✅ Non-admins (e.g., staff, residents) get full credentials
            emailBody += `
        Here are your temporary login credentials:
        Email: ${normalizedEmail}
        Temporary Password: ${tempPassword}

        Please verify your account using the link below (valid for 7 days):
        `;

            const baseUrl =
                this.config.get<string>('VERIFY_INVITE_URL') ||
                process.env.VERIFY_INVITE_URL;

            const token = this.jwt.sign(
                {
                userId: (user._id as any).toString(),
                email: normalizedEmail,
                tempPassword,
                },
                {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '7d',
                },
            );

            const encodedToken = encodeURIComponent(token);
            const signupLink = `${baseUrl}?token=${encodedToken}`;

            emailBody += `\n${signupLink}\n\nIf you didn’t expect this, you can ignore this message.\n`;
            }

            // 🔹 Send Email
            const mailOptions = {
                from: this.config.get('EMAIL_USER'),
                to: normalizedEmail,
                subject: 'Your Temporary Estate Portal Login Details',
                text: emailBody,
            };

            await transporter.sendMail(mailOptions);

            return {
                success: true,
                message: `User account for ${role} created successfully. ${
                    role.toLowerCase() === 'admin'
                    ? `A secure invite link has been sent to ${email}.`
                    : `Temporary credentials were sent to ${email}.`
                }`,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    async verifyInvitation(dto: VerifyInvitationDto) {
        try {
            const normalizedEmail = dto.email.toLowerCase().trim();

            // 🔹 Check if user exists
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                throw new NotFoundException('User not found.');
            }

            // 🔹 Check invitation status
            if (user.invitationStatus !== 'not completed') {
                throw new BadRequestException('Invitation not valid or already verified.');
            }

            // 🔹 Verify temporary password
            const isMatch = await argon.verify(user.hash, dto.tempPassword);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid temporary password.');
            }

            // 🔹 Validate new password strength
            const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/;

            if (!passwordRegex.test(dto.newPassword)) {
                throw new BadRequestException(
                    'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.',
                );
            }

            // 🔹 Hash and update password
            const hashedNewPassword = await argon.hash(dto.newPassword);
            user.hash = hashedNewPassword;
            user.isVerified = true;
            user.invitationStatus = 'completed';
            user.otp = undefined;
            user.otpExpiresAt = undefined;

            await user.save();

            return {
                success: true,
                message: 'Account verified successfully. You can now sign in with your new password.',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Complete member signup via invite link
    async completeSignup(token: string, dto: CreateUserDto) {
        try {
            // Verify the invite token
            let payload: any;
            try {
                payload = this.jwt.verify(token, {
                    secret: this.config.get<string>('JWT_SECRET'),
                });
            } catch (error) {
                throw new BadRequestException('Invalid or expired invite token');
            }

            const { email, estateId, role, addressId } = payload;

            // Find pending user
            const pendingUser = await this.userModel.findOne({
                email,
                estateId,
                role,
                invitationToken: token,
                invitationStatus: 'pending',
            });

            if (!pendingUser) {
                throw new BadRequestException('Invalid or already used invite');
            }

            // Hash password
            const hash = await argon.hash(dto.password);

            // Upload image
            let imageUrl = pendingUser.image;
            if (dto.image && dto.image.startsWith('data:image/')) {
                const publicId = `user_profiles/${Date.now()}`;
                const uploadResponse = await this.cloudinary.uploadImage(dto.image, publicId);
                imageUrl = uploadResponse.secure_url;
            }

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiresAt = new Date();
            otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

            // Update the pending user
            Object.assign(pendingUser, {
                firstName: dto.firstName,
                lastName: dto.lastName,
                image: imageUrl,
                hash,
                invitationStatus: 'completed',
                invitationToken: undefined,
                otp,
                otpExpiresAt,
            });

            // Add addressId if present in token (residents only)
            if (role === 'resident' && addressId) {
                pendingUser.addressId = addressId;
            }

            await pendingUser.save();

            // ✅ Create wallet automatically for residents
            if (role === 'resident') {
                try {
                    await this.wallet.createWallet({
                        userId: pendingUser.id.toString(),
                        balance: 0,
                        lockedBalance: 0,
                    });
                } catch (walletError) {
                    // Ignore if wallet already exists
                    if (walletError.message !== "Wallet already exists for this user.") {
                        throw walletError;
                    }
                }
            }


            // Send OTP email
            const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get<string>('EMAIL_USER'),
                pass: this.config.get<string>('EMAIL_PASS'),
            },
            });

            const mailOptions = {
                from: this.config.get<string>('EMAIL_USER'),
                to: pendingUser.email,
                subject: 'Your Membership Account OTP Verification',
                text: `Welcome! Your OTP is ${otp}. It is valid for 10 minutes.`,
            };

            await transporter.sendMail(mailOptions);

            return {
                success: true,
                message: `Registration completed. An OTP has been sent to ${pendingUser.email} for email verification.`,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // forgot password
    async forgotPassword(dto: ForgotPasswordDto) {
        // Normalize email
        const normalizedEmail = dto.email.toLowerCase().trim();

        const user = await this.userModel.findOne({email: normalizedEmail});
        if (!user) throw new NotFoundException('User not found.');
        
        // Generate a reset token (OTP style)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        try {
            await user.save();

            // Send reset token via email
            const transporter = Nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: this.config.get<string>('EMAIL_USER'),
                pass: this.config.get<string>('EMAIL_PASS'),
                },
            });

            const mailOptions = {
                from: this.config.get<string>('EMAIL_USER'),
                to: user.email,
                subject: 'Password Reset Request',
                text: `Dear ${user.firstName} ${user.lastName},\n\nYour password reset code is ${resetToken}. It is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.`,
            };

            await transporter.sendMail(mailOptions);

            return {
                message: 'Password reset instructions sent to your email.',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Reset user password
    async resetPassword(dto: ResetPasswordDto) {
        try {
            // Normalize email
            const normalizedEmail = dto.email.toLowerCase().trim();

            const { resetToken, newPassword } = dto;

            // Find user
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
            throw new NotFoundException('User not found.');
            }

            // Validate reset token
            if (
            !user.resetPasswordToken ||
            !user.resetPasswordExpires ||
            user.resetPasswordToken !== resetToken ||
            user.resetPasswordExpires < new Date()
            ) {
            throw new BadRequestException('Invalid or expired reset token.');
            }

            // Hash new password
            user.hash = await argon.hash(newPassword);

            // Clear reset fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            return {
                success: true,
                message: 'Password reset successful. You can now sign in with your new password.',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Resend OTP for all users
    async resendOtp(dto: ResendOtpDto) {
        // Normalize email
        const normalizedEmail = dto.email.toLowerCase().trim();

        const user = await this.userModel.findOne({ email: normalizedEmail});

        // Check if user exist
        if (!user) throw new NotFoundException('User not found.');
        
        // Check if the user is verified
        if (user.isVerified) throw new BadRequestException('User already verified.');

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10);

        user.otp = otp;
        user.otpExpiresAt = otpExpires;

        try {
        await user.save();
        // Implement your sendOtp logic here
        await this.sendOtp(dto.email, otp); // <-- send the OTP email here
        return { message: 'OTP resent successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Verify OTP 
    async verifyOtp(dto: VerifyOtpDto) {
        // Normalize email
        const normalizedEmail = dto.email.toLowerCase().trim();

        // Find user
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        // Check if already verified
        if (user.isVerified) {
            throw new BadRequestException('User already verified');
        }

        // Check OTP existence
        if (!user.otp || !user.otpExpiresAt) {
            throw new BadRequestException('OTP not found');
        }

        // Check expiration
        const isOtpExpired = user.otpExpiresAt < new Date();
        if (user.otp !== dto.otp || isOtpExpired) throw new BadRequestException('Invalid OTP');

        user.isVerified = true;
        user.otp = '';
        user.otpExpiresAt = new Date(0);

        try {
            await user.save();
            return { message: 'User verified successfully' };
        } catch (error) {
            throw new BadRequestException('Could not verify user. Please try again.');
        }
    }


    // refresh token 
    async refreshTokens(email: string, refreshToken: string) {
        try {
            // Normalize email
            const normalizedEmail = email.toLowerCase().trim();
            const user = await this.userModel.findOne({email: normalizedEmail});
    
            if (!user) {
            throw new ForbiddenException('Access Denied.');
            }
    
    
            if (!user.refreshToken) {
            throw new ForbiddenException("No refresh token stored");
            }
    
            const isValid = await argon.verify(user.refreshToken, refreshToken);
    
            if (!isValid) {
            throw new ForbiddenException('Invalid refresh token');
            }
    
            const payload = {
                sub: (user._id as any).toString(),
                email: user.email,
                role: user.role
            };
    
            const tokens = await this.generateToken(payload);
    
            await this.updateRefreshToken(user.email, tokens.refreshToken);
    
            return tokens;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // update refresh token
    async updateRefreshToken(email: string, refreshToken: string) {
        try {
            // 🔎 find the user by email
            const user = await this.userModel.findOne({ email: email.toLowerCase() });
    
            if (!user) {
                throw new UnauthorizedException("User not found");
            }
    
            // 🔒 hash the refresh token
            const hashedRefreshToken = await argon.hash(refreshToken);
    
            // 💾 save the hashed token
            user.refreshToken = hashedRefreshToken;
            await user.save();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // JWT generator
    private async generateToken(payload: { sub: string; email: string; role: Role }) {
        const [ accessToken, refreshToken ] = await Promise.all([
        this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: '7d',
        }),
        this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_REFRESH_TOKEN'),
            expiresIn: '30d',
        }),
        ]);

        return {
            accessToken, 
            refreshToken
        };
    }


    // ✅ Helper Method to Generate Strong Password
    private generateStrongPassword(): string {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '@$!%*?&';
        const allChars = upper + lower + numbers + special;

        let password = '';
        // Ensure at least one of each type
        password += upper[Math.floor(Math.random() * upper.length)];
        password += lower[Math.floor(Math.random() * lower.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill remaining with random chars up to 10–14 length range
        const remainingLength = Math.floor(Math.random() * 7) + 6; // 10–14 total length
        for (let i = 0; i < remainingLength; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle characters to avoid predictable order
        return password
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');
    }
  

    async getUserById(userId: string) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required.');
            }

            // Validate userId format (Mongo ObjectId)
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new BadRequestException('Invalid user ID format.');
            }

            const user = await this.userModel
            .findById(userId)
            .select('-hash -otp -otpExpiresAt -resetPasswordToken -resetPasswordExpires');

            if (!user) {
                throw new UnauthorizedException('User not found.');
            }

            const signedInUser = toResponseObject(user);

            return {
                success: true,
                message: 'Signed in user retrieved successfully.',
                data: signedInUser,
            };
        } catch (error) {
            // 🔥 Log the raw error for debugging
            console.error('getUserById error:', error);

            // Check if it's a known NestJS exception already
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
            throw error;
            }

            // Catch invalid ObjectId or unexpected Mongoose errors
            if (error.name === 'CastError') {
            throw new BadRequestException('Invalid user ID.');
            }

            // Generic fallback
            throw new InternalServerErrorException('Failed to retrieve user.');
        }
    }



    // Sign out (stateless JWT)
    async signOut(email: string, res: Response) {
        try {
            // Normalize email
            const normalizedEmail = email.toLowerCase().trim();

            // Find user
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
            return { message: 'User not found' };
            }

            // Clear refresh token in DB
            user.refreshToken = undefined;
            await user.save();

            // Clear the cookie
            res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/authentication/refresh-token',
            });

            return { message: 'Signed out successfully.' };
        } catch (error) {
            throw new BadRequestException('Could not sign out. Please try again.');
        }
    }
}

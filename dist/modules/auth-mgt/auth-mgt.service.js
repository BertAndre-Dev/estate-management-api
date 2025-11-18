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
exports.AuthMgtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schema/user.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const config_1 = require("@nestjs/config");
const Nodemailer = require("nodemailer");
const argon = require("argon2");
const cloudinary_service_1 = require("../../common/utils/cloudinary/cloudinary.service");
const wallet_mgt_service_1 = require("../wallet-mgt/wallet-mgt.service");
let AuthMgtService = class AuthMgtService {
    userModel;
    jwt;
    config;
    cloudinary;
    wallet;
    constructor(userModel, jwt, config, cloudinary, wallet) {
        this.userModel = userModel;
        this.jwt = jwt;
        this.config = config;
        this.cloudinary = cloudinary;
        this.wallet = wallet;
    }
    async signUp(dto) {
        const normalizeEmail = dto.email.toLowerCase().trim();
        const exist = await this.userModel.findOne({
            email: normalizeEmail
        });
        if (exist) {
            throw new common_1.ConflictException("User with this email already exist.");
        }
        let imageUrl;
        if (dto.image) {
            if (!dto.image.startsWith("data:image/")) {
                throw new common_1.BadRequestException("Invalid image. Image must be a base64-encoded");
            }
            try {
                const publicId = `user_profiles/${Date.now()}`;
                const uploadResponse = await this.cloudinary.uploadImage(dto.image, publicId);
                imageUrl = uploadResponse.secure_url;
            }
            catch (error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
        const hash = await argon.hash(dto.password);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);
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
                await this.sendOtp(savedUser.email, otp, savedUser.firstName ?? "", savedUser.lastName ?? "");
                return {
                    success: true,
                    message: "Sign up successful. Please verify your account with the OTP sent to your email."
                };
            }
            catch (error) {
                console.error("Failed to send OTP:", error.message);
                return {
                    success: true,
                    message: "Account created successfully, but we couldn't send your verification OTP. Please request a new OTP from the login screen."
                };
            }
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException("User with this email already exist.");
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async sendOtp(email, otp, firstName, lastName) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        const transporter = Nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async signIn(dto, res) {
        try {
            const normalizedEmail = dto.email.toLowerCase().trim();
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            if (user.lockUntil && user.lockUntil > new Date()) {
                throw new common_1.UnauthorizedException(`Account is locked. Try again after ${user.lockUntil.toLocaleTimeString()}.`);
            }
            if (!user.isVerified) {
                throw new common_1.UnauthorizedException("user is not verified");
            }
            const isPasswordCorrect = await Promise.resolve().then(() => require('argon2')).then(argon2 => argon2.verify(user.hash, dto.password));
            if (!isPasswordCorrect) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                if (user.failedLoginAttempts >= 3) {
                    user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
                    await user.save();
                    throw new common_1.UnauthorizedException('Account locked due to too many failed login attempts. Try again after 30 minutes.');
                }
                await user.save();
                throw new common_1.UnauthorizedException('Invalid password.');
            }
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                role: user.role
            };
            const tokens = await this.generateToken(payload);
            await this.updateRefreshToken(user.email, tokens.refreshToken);
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/authentication/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return {
                message: 'Signed in successfully',
                data: (0, transform_util_1.toResponseObject)(user),
                accessToken: tokens.accessToken
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async pinLogin(email, pin, res) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new common_1.BadRequestException("User does not exist.");
            }
            if (user.lockUntil && user.lockUntil > new Date()) {
                throw new common_1.UnauthorizedException(`Account is locked. Try again after ${user.lockUntil.toLocaleTimeString()}`);
            }
            if (!user.isVerified) {
                throw new common_1.UnauthorizedException(`Account is not verified.`);
            }
            const isPinValid = await argon.verify(user.pinHash, pin);
            if (!isPinValid) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                if (user.failedLoginAttempts >= 3) {
                    user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
                    await user.save();
                    throw new common_1.UnauthorizedException("Account has been locked due to too many failed login attempts. Try again after 30 minutes.");
                }
                await user.save();
                throw new common_1.UnauthorizedException("Invalid Pin");
            }
            user.failedLoginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                role: user.role
            };
            const tokens = await this.generateToken(payload);
            await this.updateRefreshToken(user.email, tokens.refreshToken);
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/authentication/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return {
                message: 'Signed in successfully',
                data: (0, transform_util_1.toResponseObject)(user),
                accessToken: tokens.accessToken
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async inviteUser(dto) {
        try {
            const { estateId, email, role, addressId, firstName, lastName } = dto;
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await this.userModel.findOne({ email: normalizedEmail });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            if (role === 'resident') {
                if (!addressId) {
                    throw new common_1.BadRequestException('Address ID is required for residents.');
                }
                const addressInUse = await this.userModel.findOne({
                    estateId,
                    addressId,
                    role: 'resident',
                });
                if (addressInUse) {
                    throw new common_1.ConflictException('This address has already been assigned to a resident.');
                }
            }
            const tempPassword = this.generateStrongPassword();
            const hashedPassword = await argon.hash(tempPassword);
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
            const transporter = Nodemailer.createTransport({
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
            if (role.toLowerCase() === 'admin') {
                const baseUrl = this.config.get('VERIFY_INVITE_URL') ||
                    process.env.VERIFY_INVITE_URL;
                if (!baseUrl) {
                    throw new Error('VERIFY_INVITE_URL is not defined in the environment');
                }
                const token = this.jwt.sign({
                    userId: user._id.toString(),
                    email: normalizedEmail,
                    tempPassword,
                }, {
                    secret: this.config.get('JWT_SECRET'),
                    expiresIn: '7d',
                });
                const encodedToken = encodeURIComponent(token);
                const signupLink = `${baseUrl}?token=${encodedToken}`;
                emailBody += `
        A secure link has been generated for you to verify and complete your setup.
        Click the link below (valid for 7 days):

        ${signupLink}

        If you didn’t request this, you can ignore this email.
        `;
            }
            else {
                emailBody += `
        Here are your temporary login credentials:
        Email: ${normalizedEmail}
        Temporary Password: ${tempPassword}

        Please verify your account using the link below (valid for 7 days):
        `;
                const baseUrl = this.config.get('VERIFY_INVITE_URL') ||
                    process.env.VERIFY_INVITE_URL;
                const token = this.jwt.sign({
                    userId: user._id.toString(),
                    email: normalizedEmail,
                    tempPassword,
                }, {
                    secret: this.config.get('JWT_SECRET'),
                    expiresIn: '7d',
                });
                const encodedToken = encodeURIComponent(token);
                const signupLink = `${baseUrl}?token=${encodedToken}`;
                emailBody += `\n${signupLink}\n\nIf you didn’t expect this, you can ignore this message.\n`;
            }
            const mailOptions = {
                from: this.config.get('EMAIL_USER'),
                to: normalizedEmail,
                subject: 'Your Temporary Estate Portal Login Details',
                text: emailBody,
            };
            await transporter.sendMail(mailOptions);
            return {
                success: true,
                message: `User account for ${role} created successfully. ${role.toLowerCase() === 'admin'
                    ? `A secure invite link has been sent to ${email}.`
                    : `Temporary credentials were sent to ${email}.`}`,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyInvitation(dto) {
        try {
            const normalizedEmail = dto.email.toLowerCase().trim();
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            if (user.invitationStatus !== 'not completed') {
                throw new common_1.BadRequestException('Invitation not valid or already verified.');
            }
            const isMatch = await argon.verify(user.hash, dto.tempPassword);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Invalid temporary password.');
            }
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/;
            if (!passwordRegex.test(dto.newPassword)) {
                throw new common_1.BadRequestException('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
            }
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async completeSignup(token, dto) {
        try {
            let payload;
            try {
                payload = this.jwt.verify(token, {
                    secret: this.config.get('JWT_SECRET'),
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Invalid or expired invite token');
            }
            const { email, estateId, role, addressId } = payload;
            const pendingUser = await this.userModel.findOne({
                email,
                estateId,
                role,
                invitationToken: token,
                invitationStatus: 'pending',
            });
            if (!pendingUser) {
                throw new common_1.BadRequestException('Invalid or already used invite');
            }
            const hash = await argon.hash(dto.password);
            let imageUrl = pendingUser.image;
            if (dto.image && dto.image.startsWith('data:image/')) {
                const publicId = `user_profiles/${Date.now()}`;
                const uploadResponse = await this.cloudinary.uploadImage(dto.image, publicId);
                imageUrl = uploadResponse.secure_url;
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiresAt = new Date();
            otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);
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
            if (role === 'resident' && addressId) {
                pendingUser.addressId = addressId;
            }
            await pendingUser.save();
            if (role === 'resident') {
                try {
                    await this.wallet.createWallet({
                        userId: pendingUser.id.toString(),
                        balance: 0,
                        lockedBalance: 0,
                    });
                }
                catch (walletError) {
                    if (walletError.message !== "Wallet already exists for this user.") {
                        throw walletError;
                    }
                }
            }
            const transporter = Nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.config.get('EMAIL_USER'),
                    pass: this.config.get('EMAIL_PASS'),
                },
            });
            const mailOptions = {
                from: this.config.get('EMAIL_USER'),
                to: pendingUser.email,
                subject: 'Your Membership Account OTP Verification',
                text: `Welcome! Your OTP is ${otp}. It is valid for 10 minutes.`,
            };
            await transporter.sendMail(mailOptions);
            return {
                success: true,
                message: `Registration completed. An OTP has been sent to ${pendingUser.email} for email verification.`,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async forgotPassword(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        try {
            await user.save();
            const transporter = Nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.config.get('EMAIL_USER'),
                    pass: this.config.get('EMAIL_PASS'),
                },
            });
            const mailOptions = {
                from: this.config.get('EMAIL_USER'),
                to: user.email,
                subject: 'Password Reset Request',
                text: `Dear ${user.firstName} ${user.lastName},\n\nYour password reset code is ${resetToken}. It is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.`,
            };
            await transporter.sendMail(mailOptions);
            return {
                message: 'Password reset instructions sent to your email.',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resetPassword(dto) {
        try {
            const normalizedEmail = dto.email.toLowerCase().trim();
            const { resetToken, newPassword } = dto;
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            if (!user.resetPasswordToken ||
                !user.resetPasswordExpires ||
                user.resetPasswordToken !== resetToken ||
                user.resetPasswordExpires < new Date()) {
                throw new common_1.BadRequestException('Invalid or expired reset token.');
            }
            user.hash = await argon.hash(newPassword);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return {
                success: true,
                message: 'Password reset successful. You can now sign in with your new password.',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resendOtp(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        if (user.isVerified)
            throw new common_1.BadRequestException('User already verified.');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10);
        user.otp = otp;
        user.otpExpiresAt = otpExpires;
        try {
            await user.save();
            await this.sendOtp(dto.email, otp);
            return { message: 'OTP resent successfully.' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async verifyOtp(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException('User already verified');
        }
        if (!user.otp || !user.otpExpiresAt) {
            throw new common_1.BadRequestException('OTP not found');
        }
        const isOtpExpired = user.otpExpiresAt < new Date();
        if (user.otp !== dto.otp || isOtpExpired)
            throw new common_1.BadRequestException('Invalid OTP');
        user.isVerified = true;
        user.otp = '';
        user.otpExpiresAt = new Date(0);
        try {
            await user.save();
            return { message: 'User verified successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Could not verify user. Please try again.');
        }
    }
    async refreshTokens(email, refreshToken) {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                throw new common_1.ForbiddenException('Access Denied.');
            }
            if (!user.refreshToken) {
                throw new common_1.ForbiddenException("No refresh token stored");
            }
            const isValid = await argon.verify(user.refreshToken, refreshToken);
            if (!isValid) {
                throw new common_1.ForbiddenException('Invalid refresh token');
            }
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                role: user.role
            };
            const tokens = await this.generateToken(payload);
            await this.updateRefreshToken(user.email, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateRefreshToken(email, refreshToken) {
        try {
            const user = await this.userModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new common_1.UnauthorizedException("User not found");
            }
            const hashedRefreshToken = await argon.hash(refreshToken);
            user.refreshToken = hashedRefreshToken;
            await user.save();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async generateToken(payload) {
        const [accessToken, refreshToken] = await Promise.all([
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
    generateStrongPassword() {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '@$!%*?&';
        const allChars = upper + lower + numbers + special;
        let password = '';
        password += upper[Math.floor(Math.random() * upper.length)];
        password += lower[Math.floor(Math.random() * lower.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        const remainingLength = Math.floor(Math.random() * 7) + 6;
        for (let i = 0; i < remainingLength; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        return password
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');
    }
    async getUserById(userId) {
        try {
            if (!userId) {
                throw new common_1.BadRequestException('User ID is required.');
            }
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new common_1.BadRequestException('Invalid user ID format.');
            }
            const user = await this.userModel
                .findById(userId)
                .select('-hash -otp -otpExpiresAt -resetPasswordToken -resetPasswordExpires');
            if (!user) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            const signedInUser = (0, transform_util_1.toResponseObject)(user);
            return {
                success: true,
                message: 'Signed in user retrieved successfully.',
                data: signedInUser,
            };
        }
        catch (error) {
            console.error('getUserById error:', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException('Invalid user ID.');
            }
            throw new common_1.InternalServerErrorException('Failed to retrieve user.');
        }
    }
    async signOut(email, res) {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const user = await this.userModel.findOne({ email: normalizedEmail });
            if (!user) {
                return { message: 'User not found' };
            }
            user.refreshToken = undefined;
            await user.save();
            res.clearCookie('refresh_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/authentication/refresh-token',
            });
            return { message: 'Signed out successfully.' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Could not sign out. Please try again.');
        }
    }
};
exports.AuthMgtService = AuthMgtService;
exports.AuthMgtService = AuthMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        cloudinary_service_1.CloudinaryService,
        wallet_mgt_service_1.WalletMgtService])
], AuthMgtService);
//# sourceMappingURL=auth-mgt.service.js.map
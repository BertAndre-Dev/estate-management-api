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
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toResponseObject } from "../../common/utils/transform.util";
import { CloudinaryService } from "../../common/utils/cloudinary/cloudinary.service";
import { User } from "../../schema/user.schema";
import * as argon from 'argon2';
import { Estate } from "../../schema/estate.schema";
let UserMgtService = class UserMgtService {
    userModel;
    estateModel;
    cloudinary;
    constructor(userModel, estateModel, cloudinary) {
        this.userModel = userModel;
        this.estateModel = estateModel;
        this.cloudinary = cloudinary;
    }
    async updateUser(id, dto) {
        try {
            const user = await this.userModel.findById(id);
            const base64Image = dto.image;
            let imageUrl;
            if (base64Image) {
                if (!base64Image.startsWith("data:image/")) {
                    throw new BadRequestException("Invalid image. Image must be a base64-encoded image");
                }
                try {
                    const publicId = `user_profiles/${Date.now()}`;
                    const uploadResponse = await this.cloudinary.uploadImage(base64Image, publicId);
                    imageUrl = uploadResponse.secure_url;
                }
                catch (error) {
                    throw new BadRequestException('Error uploading image');
                }
            }
            if (!user) {
                throw new NotFoundException("User does not exist.");
            }
            user.set({
                ...dto,
                image: imageUrl
            });
            await user.save();
            return {
                success: true,
                message: "User updated successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getUsersByEstate(estateId, requesterRole, page = 1, limit = 10) {
        try {
            if (!estateId || typeof estateId !== 'string') {
                throw new BadRequestException('A valid estateId is required.');
            }
            const skip = (page - 1) * limit;
            const query = { estateId: estateId.trim() };
            if (requesterRole === 'admin') {
                query.role = 'resident';
            }
            const [users, total] = await Promise.all([
                this.userModel
                    .find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.userModel.countDocuments(query),
            ]);
            return {
                success: true,
                message: users.length
                    ? 'Estate users retrieved successfully.'
                    : 'No users found for this estate.',
                data: toResponseObject(users),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit) || 1,
                },
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getUser(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new BadRequestException("User does not exist.");
            }
            return {
                success: true,
                message: "User retrieved successfully.",
                data: toResponseObject(user)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteUser(id) {
        try {
            const user = await this.userModel.findByIdAndDelete(id);
            if (!user) {
                throw new BadRequestException("User does not exist.");
            }
            await this.estateModel.deleteMany({ id });
            return {
                success: true,
                message: "User deleted successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendUser(id) {
        try {
            const suspendUser = await this.userModel.findById(id);
            if (!suspendUser) {
                throw new NotFoundException("User not found.");
            }
            if (!suspendUser.isActive) {
                throw new BadRequestException("User is already suspended.");
            }
            suspendUser.isActive = false;
            await suspendUser.save();
            return {
                success: true,
                message: "User suspended successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateUser(id) {
        try {
            const activateUser = await this.userModel.findById(id);
            if (!activateUser) {
                throw new NotFoundException("User not found.");
            }
            if (activateUser.isActive) {
                throw new BadRequestException("User is already active.");
            }
            activateUser.isActive = true;
            await activateUser.save();
            return {
                success: true,
                message: "User activated successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updatePassword(id, dto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new NotFoundException("User not found.");
            }
            const isCurrentPasswordValid = await argon.verify(user.hash, dto.currentPassword);
            if (!isCurrentPasswordValid) {
                throw new UnauthorizedException("Current password is incorrect.");
            }
            if (dto.currentPassword === dto.newPassword) {
                throw new BadRequestException("New password must be different from the current password.");
            }
            user.hash = await argon.hash(dto.newPassword);
            await user.save();
            return {
                success: true,
                message: "Password updated successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updatePin(id, dto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new NotFoundException("User doe not exist.");
            }
            const isCurrentPinValid = await argon.verify(user.pinHash, dto.currentPin);
            if (!isCurrentPinValid) {
                throw new BadRequestException("Current pin is incorrect.");
            }
            if (dto.currentPin === dto.newPin) {
                throw new BadRequestException("New pin must be different from the current pin.");
            }
            user.pinHash = await argon.hash(dto.newPin);
            await user.save();
            return {
                success: true,
                message: "Pin changed successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
UserMgtService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __param(1, InjectModel(Estate.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        CloudinaryService])
], UserMgtService);
export { UserMgtService };
//# sourceMappingURL=user-mgt.service.js.map
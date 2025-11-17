import { 
    Injectable,
    BadRequestException,
    NotFoundException, 
    UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { toResponseObject } from 'src/common/utils/transform.util';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { User, UserDocument } from 'src/schema/user.schema';
import * as argon from 'argon2';
import { UpdatePasswordDto } from 'src/dto/user-dto/update-password.dto';
import { UpdatePinDto } from 'src/dto/user-dto/update-pin.dto';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
import { Estate, EstateDocument } from 'src/schema/estate.schema';

@Injectable()
export class UserMgtService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
        private cloudinary: CloudinaryService
    ){}

    // update user
    async updateUser(id: string, dto: UpdateUserDto) {
        try {
            const user = await this.userModel.findById(id);

            // verify image
            const base64Image = dto.image;
            let imageUrl: string | undefined;

            if (base64Image) {
                if (!base64Image.startsWith("data:image/")) {
                    throw new BadRequestException("Invalid image. Image must be a base64-encoded image");
                }

                // upload image to cloudinary
                try {
                    const publicId = `user_profiles/${Date.now()}`;
                    const uploadResponse = await this.cloudinary.uploadImage(base64Image, publicId);
                    imageUrl = uploadResponse.secure_url;
                } catch (error) {
                    throw new BadRequestException('Error uploading image');
                }
            }

            // check if the user exist
            if (!user) {
                throw new NotFoundException("User does not exist.");
            }

            // update user
            user.set({
                ...dto,
                image: imageUrl
            })

            await user.save();

            return {
                success: true,
                message: "User updated successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get users by estate with role-based visibility
    async getUsersByEstate(
        estateId: string,
        requesterRole: string, // role of the logged-in user
        page = 1,
        limit = 10
    ) {
        try {
            if (!estateId || typeof estateId !== 'string') {
                throw new BadRequestException('A valid estateId is required.');
            }

            const skip = (page - 1) * limit;

            // Base query: filter by estateId
            const query: Record<string, any> = { estateId: estateId.trim() };

            // ✅ Admin can only see residents in their estate
            if (requesterRole === 'admin') {
                query.role = 'resident';
            }

            // ✅ Super admin can see all users in the estate (no additional filter)

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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    // get user
    async getUser(id: string) {
        try {
            const user = await this.userModel.findById(id);

            // check if the user exist
            if (!user) {
                throw new BadRequestException("User does not exist.");
            }

            return {
                success: true,
                message: "User retrieved successfully.",
                data: toResponseObject(user)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // delete user
    async deleteUser(id: string) {
        try {
            const user = await this.userModel.findByIdAndDelete(id);
    
            // check if the user exist
            if (!user) {
                throw new BadRequestException("User does not exist.");
            }
    
            // delete all associated estates
            await this.estateModel.deleteMany({ id });

            return {
                success: true,
                message: "User deleted successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // suspend user
    async suspendUser(id: string) {
        try {
            const suspendUser = await this.userModel.findById(id);
    
            // check if the user exist
            if (!suspendUser) {
                throw new NotFoundException("User not found.");
            }
    
            // check if the user is suspended
            if (!suspendUser.isActive) {
                throw new BadRequestException("User is already suspended.");
            }
    
            // suspend user
            suspendUser.isActive = false;
    
            await suspendUser.save();
    
            return {
                success: true,
                message: "User suspended successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // activate user
    async activateUser(id: string) {
        try {
            const activateUser = await this.userModel.findById(id);

            // check if the user already exist
            if (!activateUser) {
                throw new NotFoundException("User not found.");
            }

            // check if the user is active
            if (activateUser.isActive) {
                throw new BadRequestException("User is already active.");
            }

            // activate user
            activateUser.isActive = true;

            await activateUser.save();

            return {
                success: true,
                message: "User activated successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // update user password
    async updatePassword(id: string, dto: UpdatePasswordDto) {
        try {
            const user = await this.userModel.findById(id);
    
            // check if the user exist
            if (!user) {
                throw new NotFoundException("User not found.");
            }
    
            // verify current password
            const isCurrentPasswordValid = await argon.verify(user.hash, dto.currentPassword);

            if (!isCurrentPasswordValid) {
                throw new UnauthorizedException("Current password is incorrect.");
            }

            // validate new password
            if (dto.currentPassword === dto.newPassword) {
                throw new BadRequestException("New password must be different from the current password.");
            }

            // hash the new password
            user.hash = await argon.hash(dto.newPassword);
            await user.save();

            return {
                success: true,
                message: "Password updated successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // update pin 
    async updatePin(id: string, dto: UpdatePinDto) {
        try {
            const user = await this.userModel.findById(id);

            // check if the user exist
            if (!user) {
                throw new NotFoundException("User doe not exist.");
            }

            // verify current pin
            const isCurrentPinValid = await argon.verify(user.pinHash, dto.currentPin);

            if (!isCurrentPinValid) {
                throw new BadRequestException("Current pin is incorrect.");
            }

            // validate new pin
            if (dto.currentPin === dto.newPin) {
                throw new BadRequestException("New pin must be different from the current pin.");
            }

            // hash the new pin
            user.pinHash = await argon.hash(dto.newPin);

            await user.save();

            return {
                success: true,
                message: "Pin changed successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}

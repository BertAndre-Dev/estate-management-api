import { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UserDocument } from 'src/schema/user.schema';
import { UpdatePasswordDto } from 'src/dto/user-dto/update-password.dto';
import { UpdatePinDto } from 'src/dto/user-dto/update-pin.dto';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
import { EstateDocument } from 'src/schema/estate.schema';
export declare class UserMgtService {
    private userModel;
    private estateModel;
    private cloudinary;
    constructor(userModel: Model<UserDocument>, estateModel: Model<EstateDocument>, cloudinary: CloudinaryService);
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getUsersByEstate(estateId: string, requesterRole: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: any;
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getUser(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    suspendUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updatePin(id: string, dto: UpdatePinDto): Promise<{
        success: boolean;
        message: string;
    }>;
}

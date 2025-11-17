import { UserMgtService } from './user-mgt.service';
import { UpdatePasswordDto } from 'src/dto/user-dto/update-password.dto';
import { UpdatePinDto } from 'src/dto/user-dto/update-pin.dto';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
export declare class UserMgtController {
    private readonly user;
    constructor(user: UserMgtService);
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUser(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getUsersByEstate(estateId: string, page: number | undefined, limit: number | undefined, req: any): Promise<{
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
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updatePin(id: string, dto: UpdatePinDto): Promise<{
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
}

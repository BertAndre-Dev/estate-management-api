import { Document } from 'mongoose';
import { Role } from 'src/common/enum/roles.enum';
export type UserDocument = User & Document;
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    countryCode?: string;
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: string;
    addressId?: string;
    estateId?: string;
    pinHash: string;
    isMobileUser: boolean;
    role: Role;
    hash: string;
    isActive: boolean;
    serviceCharge: boolean;
    walletId?: string;
    hashedRt?: string | null;
    refreshToken?: string;
    invitationToken?: string;
    invitationStatus?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    image?: string;
    failedLoginAttempts?: number;
    lockUntil?: Date;
    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

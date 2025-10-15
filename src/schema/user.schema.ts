import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enum/roles.enum';

export type UserDocument = User & Document;

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    })
    email: string;

    @Prop()
    countryCode?: string;

    @Prop()
    dateOfBirth?: string;

    @Prop()
    gender?: string;

    @Prop()
    phoneNumber?: string;
    
    @Prop()
    addressId?: string;

    @Prop({
        required: true
    })
    estateId: string;

    @Prop()
    pinHash: string;

    @Prop({ 
        default: false 
    })
    isMobileUser: boolean;

    @Prop({
        required: true,
        default: Role.RESIDENT,
        enum: Role
    })
    role: Role;

    @Prop({
        required: true
    })
    hash: string;

    @Prop({
        default: true
    })
    isActive: boolean;

    @Prop({
        default: false
    })
    serviceCharge: boolean;

    @Prop({
        type: String,
        default: null,
    })
    hashedRt?: string | null;

    @Prop({ 
        default: null 
    })
    refreshToken?: string;

    @Prop()
    invitationToken?: string;

    @Prop()
    invitationStatus?: string;

    @Prop()
    resetPasswordToken?: string;
    
    @Prop()
    resetPasswordExpires?: Date;

    @Prop()
    image?: string;

    @Prop({ 
        default: 0 
    })
    failedLoginAttempts?: number;

    @Prop({ 
        default: null 
    })
    lockUntil?: Date;

    @Prop({
        default: false,
    })
    isVerified: boolean;

    @Prop()
    otp?: string;

    @Prop()
    otpExpiresAt?: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Ensure a case-insensitive unique index on email
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 }, // Case-insensitive collation
  }
);

// ✅ Optional: normalize email before saving (as a failsafe)
UserSchema.pre("save", function (next) {
  if (this.isModified("email") && this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from "../common/enum/roles.enum";
let User = class User {
    firstName;
    lastName;
    email;
    countryCode;
    dateOfBirth;
    gender;
    phoneNumber;
    addressId;
    estateId;
    pinHash;
    isMobileUser;
    role;
    hash;
    isActive;
    serviceCharge;
    walletId;
    hashedRt;
    refreshToken;
    invitationToken;
    invitationStatus;
    resetPasswordToken;
    resetPasswordExpires;
    image;
    failedLoginAttempts;
    lockUntil;
    isVerified;
    otp;
    otpExpiresAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "countryCode", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "addressId", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "estateId", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "pinHash", void 0);
__decorate([
    Prop({
        default: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isMobileUser", void 0);
__decorate([
    Prop({
        required: true,
        default: Role.RESIDENT,
        enum: Role
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], User.prototype, "hash", void 0);
__decorate([
    Prop({
        default: true
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    Prop({
        default: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "serviceCharge", void 0);
__decorate([
    Prop({
        default: null
    }),
    __metadata("design:type", String)
], User.prototype, "walletId", void 0);
__decorate([
    Prop({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], User.prototype, "hashedRt", void 0);
__decorate([
    Prop({
        default: null
    }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "invitationToken", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "invitationStatus", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    Prop({
        default: 0
    }),
    __metadata("design:type", Number)
], User.prototype, "failedLoginAttempts", void 0);
__decorate([
    Prop({
        default: null
    }),
    __metadata("design:type", Date)
], User.prototype, "lockUntil", void 0);
__decorate([
    Prop({
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], User.prototype, "otpExpiresAt", void 0);
User = __decorate([
    Schema({
        timestamps: true
    })
], User);
export { User };
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, {
    unique: true,
    collation: { locale: "en", strength: 2 },
});
UserSchema.pre("save", function (next) {
    if (this.isModified("email") && this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});
//# sourceMappingURL=user.schema.js.map
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
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Model } from "mongoose";
import { User } from "../../schema/user.schema";
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    userModel;
    constructor(config, userModel) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        });
        this.userModel = userModel;
    }
    async validate(payload) {
        const { sub: userId, role } = payload;
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        if (role && user.role !== role) {
            throw new UnauthorizedException("Invalid user role");
        }
        return user;
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __param(1, InjectModel(User.name)),
    __metadata("design:paramtypes", [ConfigService,
        Model])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map
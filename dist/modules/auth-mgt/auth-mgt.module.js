var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AuthMgtService } from './auth-mgt.service';
import { AuthMgtController } from './auth-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "../../common/strategy";
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from "../../schema/user.schema";
import { CloudinaryService } from "../../common/utils/cloudinary/cloudinary.service";
import { CloudinaryController } from "../../common/utils/cloudinary/cloudinary.controller";
import { WalletMgtService } from '../wallet-mgt/wallet-mgt.service';
import { WalletSchema, Wallet } from "../../schema/wallet.schema";
let AuthMgtModule = class AuthMgtModule {
};
AuthMgtModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{
                    name: User.name,
                    schema: UserSchema
                }]),
            MongooseModule.forFeature([{
                    name: Wallet.name,
                    schema: WalletSchema
                }]),
            JwtModule.register({}),
            ConfigModule
        ],
        providers: [
            AuthMgtService,
            CloudinaryService,
            JwtStrategy,
            WalletMgtService
        ],
        controllers: [
            AuthMgtController,
            CloudinaryController
        ],
        exports: [AuthMgtService]
    })
], AuthMgtModule);
export { AuthMgtModule };
//# sourceMappingURL=auth-mgt.module.js.map
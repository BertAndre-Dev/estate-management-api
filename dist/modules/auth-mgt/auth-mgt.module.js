"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMgtModule = void 0;
const common_1 = require("@nestjs/common");
const auth_mgt_service_1 = require("./auth-mgt.service");
const auth_mgt_controller_1 = require("./auth-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const strategy_1 = require("../../common/strategy");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("../../schema/user.schema");
const cloudinary_service_1 = require("../../common/utils/cloudinary/cloudinary.service");
const cloudinary_controller_1 = require("../../common/utils/cloudinary/cloudinary.controller");
const wallet_mgt_service_1 = require("../wallet-mgt/wallet-mgt.service");
const wallet_schema_1 = require("../../schema/wallet.schema");
let AuthMgtModule = class AuthMgtModule {
};
exports.AuthMgtModule = AuthMgtModule;
exports.AuthMgtModule = AuthMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: wallet_schema_1.Wallet.name,
                    schema: wallet_schema_1.WalletSchema
                }]),
            jwt_1.JwtModule.register({}),
            config_1.ConfigModule
        ],
        providers: [
            auth_mgt_service_1.AuthMgtService,
            cloudinary_service_1.CloudinaryService,
            strategy_1.JwtStrategy,
            wallet_mgt_service_1.WalletMgtService
        ],
        controllers: [
            auth_mgt_controller_1.AuthMgtController,
            cloudinary_controller_1.CloudinaryController
        ],
        exports: [auth_mgt_service_1.AuthMgtService]
    })
], AuthMgtModule);
//# sourceMappingURL=auth-mgt.module.js.map
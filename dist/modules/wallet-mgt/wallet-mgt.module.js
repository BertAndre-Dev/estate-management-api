"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMgtModule = void 0;
const common_1 = require("@nestjs/common");
const wallet_mgt_service_1 = require("./wallet-mgt.service");
const wallet_mgt_controller_1 = require("./wallet-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_schema_1 = require("../../schema/wallet.schema");
const user_schema_1 = require("../../schema/user.schema");
let WalletMgtModule = class WalletMgtModule {
};
exports.WalletMgtModule = WalletMgtModule;
exports.WalletMgtModule = WalletMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: wallet_schema_1.Wallet.name,
                    schema: wallet_schema_1.WalletSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
        ],
        providers: [wallet_mgt_service_1.WalletMgtService],
        controllers: [wallet_mgt_controller_1.WalletMgtController],
        exports: [wallet_mgt_service_1.WalletMgtService]
    })
], WalletMgtModule);
//# sourceMappingURL=wallet-mgt.module.js.map
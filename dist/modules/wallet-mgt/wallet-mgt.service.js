"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMgtService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("../../schema/wallet.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const user_schema_1 = require("../../schema/user.schema");
let WalletMgtService = class WalletMgtService {
    walletModel;
    userModel;
    constructor(walletModel, userModel) {
        this.walletModel = walletModel;
        this.userModel = userModel;
    }
    async createWallet(dto) {
        if (!dto.userId) {
            throw new common_1.BadRequestException("userId is required.");
        }
        const existingWallet = await this.walletModel.findOne({ userId: dto.userId });
        if (existingWallet) {
            throw new common_1.BadRequestException("Wallet already exists for this user.");
        }
        try {
            const wallet = new this.walletModel(dto);
            const savedWallet = await wallet.save();
            await this.userModel.findByIdAndUpdate(dto.userId, { walletId: savedWallet._id });
            const response = (0, transform_util_1.toResponseObject)(savedWallet);
            return {
                success: true,
                message: "Wallet created successfully.",
                data: response
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getWalletDetails(userId) {
        try {
            if (!userId) {
                throw new common_1.BadRequestException("userId is required.");
            }
            const wallet = await this.walletModel.findOne({ userId });
            if (!wallet) {
                throw new common_1.BadRequestException("Wallet does not exist for this user.");
            }
            const response = (0, transform_util_1.toResponseObject)(wallet);
            return {
                success: true,
                message: "Wallet details retrieved successfully.",
                data: response
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.WalletMgtService = WalletMgtService;
exports.WalletMgtService = WalletMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WalletMgtService);
//# sourceMappingURL=wallet-mgt.service.js.map
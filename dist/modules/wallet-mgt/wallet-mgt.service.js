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
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from "../../schema/wallet.schema";
import { toResponseObject } from "../../common/utils/transform.util";
import { User } from "../../schema/user.schema";
let WalletMgtService = class WalletMgtService {
    walletModel;
    userModel;
    constructor(walletModel, userModel) {
        this.walletModel = walletModel;
        this.userModel = userModel;
    }
    async createWallet(dto) {
        if (!dto.userId) {
            throw new BadRequestException("userId is required.");
        }
        const existingWallet = await this.walletModel.findOne({ userId: dto.userId });
        if (existingWallet) {
            throw new BadRequestException("Wallet already exists for this user.");
        }
        try {
            const wallet = new this.walletModel(dto);
            const savedWallet = await wallet.save();
            await this.userModel.findByIdAndUpdate(dto.userId, { walletId: savedWallet._id });
            const response = toResponseObject(savedWallet);
            return {
                success: true,
                message: "Wallet created successfully.",
                data: response
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getWalletDetails(userId) {
        try {
            if (!userId) {
                throw new BadRequestException("userId is required.");
            }
            const wallet = await this.walletModel.findOne({ userId });
            if (!wallet) {
                throw new BadRequestException("Wallet does not exist for this user.");
            }
            const response = toResponseObject(wallet);
            return {
                success: true,
                message: "Wallet details retrieved successfully.",
                data: response
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
WalletMgtService = __decorate([
    Injectable(),
    __param(0, InjectModel(Wallet.name)),
    __param(1, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model,
        Model])
], WalletMgtService);
export { WalletMgtService };
//# sourceMappingURL=wallet-mgt.service.js.map
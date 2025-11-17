import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from 'src/schema/wallet.schema';
import { CreateWalletDto } from 'src/dto/wallet.dto';
import { toResponseObject } from 'src/common/utils/transform.util';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class WalletMgtService {
    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}


    // create wallet
    async createWallet(dto: CreateWalletDto) {
        if (!dto.userId) {
            throw new BadRequestException("userId is required.");
        }

        // Check if wallet already exists for the user
        const existingWallet = await this.walletModel.findOne({ userId: dto.userId });
        if (existingWallet) {
            throw new BadRequestException("Wallet already exists for this user.");
        }

        try {
            const wallet = new this.walletModel(dto);
            const savedWallet = await wallet.save();

            // Update user with the walletId
            await this.userModel.findByIdAndUpdate(dto.userId, { walletId: savedWallet._id });

            const response = toResponseObject(savedWallet);

            return {
                success: true,
                message: "Wallet created successfully.",
                data: response
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get wallet details
    async getWalletDetails(userId: string) {
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}

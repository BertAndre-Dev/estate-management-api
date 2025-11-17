import { Model } from 'mongoose';
import { WalletDocument } from 'src/schema/wallet.schema';
import { CreateWalletDto } from 'src/dto/wallet.dto';
import { UserDocument } from 'src/schema/user.schema';
export declare class WalletMgtService {
    private walletModel;
    private userModel;
    constructor(walletModel: Model<WalletDocument>, userModel: Model<UserDocument>);
    createWallet(dto: CreateWalletDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getWalletDetails(userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}

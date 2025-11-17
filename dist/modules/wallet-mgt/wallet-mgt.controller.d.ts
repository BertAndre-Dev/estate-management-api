import { WalletMgtService } from './wallet-mgt.service';
import { CreateWalletDto } from 'src/dto/wallet.dto';
export declare class WalletMgtController {
    private readonly wallet;
    constructor(wallet: WalletMgtService);
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

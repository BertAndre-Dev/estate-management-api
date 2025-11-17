import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { Transaction } from 'src/schema/sts/transactions.schema';
import { VendPowerDto } from 'src/dto/vend-power.dto';
export declare class VendingService {
    private readonly http;
    private readonly authService;
    private readonly txModel;
    private readonly baseUrl;
    private readonly logger;
    private readonly creds;
    constructor(http: HttpService, authService: AuthService, txModel: Model<Transaction>);
    vendPower(dto: VendPowerDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private generateSeed;
    private formatUtcDateTime;
}

import { ConfigService } from '@nestjs/config';
import { InitializePaymentDto } from 'src/dto/flutter-wave.dto';
import { PaymentType } from 'src/common/enum/payment-type.enum';
export declare class PaymentMgtService {
    private config;
    private readonly logger;
    private readonly baseUrl;
    private readonly secretKey;
    private readonly redirectBaseUrl;
    private readonly webhookSecretHash;
    constructor(config: ConfigService);
    initializePayment(body: InitializePaymentDto): Promise<any>;
    verifyPayment(tx_ref: string, paymentType: PaymentType): Promise<{
        status: string;
        message: string;
        totalAmount?: undefined;
        distributedTo?: undefined;
    } | {
        status: string;
        message: string;
        totalAmount: number;
        distributedTo?: undefined;
    } | {
        status: string;
        message: string;
        totalAmount: number;
        distributedTo: number;
    }>;
    initiatePayout(data: {
        amount: number;
        currency: string;
        narration: string;
        bank: string;
        account: string;
    }): Promise<any>;
    private getPaymentOptionsByCountry;
    private countryToCurrencyMap;
    private paymentOptionsMap;
    private payoutOptionsMap;
    getPaymentMethodsByCountry(countryCode: string): {
        country: string;
        currency: string;
        methods: any;
    };
    getPayoutMethodsByCountry(countryCode: string): {
        country: string;
        currency: string;
        methods: any;
    };
}

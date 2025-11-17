import { PaymentMgtService } from './payment-mgt.service';
import { InitializePaymentDto } from 'src/dto/flutter-wave.dto';
import { PaymentType } from 'src/common/enum/payment-type.enum';
export declare class PaymentMgtController {
    private readonly payment;
    constructor(payment: PaymentMgtService);
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
    getPaymentMethods(country: string): Promise<{
        success: boolean;
        message: string;
        paymentMethods: {
            country: string;
            currency: string;
            methods: any;
        };
    }>;
}

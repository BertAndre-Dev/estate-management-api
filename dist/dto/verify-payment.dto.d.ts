import { PaymentType } from 'src/common/enum/payment-type.enum';
export declare class VerifyPaymentDto {
    paymentType: PaymentType;
    tx_ref: string;
}

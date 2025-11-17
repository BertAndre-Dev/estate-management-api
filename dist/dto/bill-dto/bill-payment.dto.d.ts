export declare class BillPaymentDto {
    billId: string;
    userId: string;
    walletId: string;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    amountPaid: number;
}

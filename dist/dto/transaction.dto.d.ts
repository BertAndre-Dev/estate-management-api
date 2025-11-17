export declare class CreateTransactionDto {
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    userId: string;
}

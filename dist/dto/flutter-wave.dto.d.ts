export declare class CustomerDto {
    email: string;
}
export declare class CustomizationsDto {
    title: string;
    description: string;
}
export declare class InitializePaymentDto {
    tx_ref: string;
    amount: number;
    country: string;
    currency: string;
    redirect_url: string;
    payment_options: string;
    customer: CustomerDto;
    customizations: CustomizationsDto;
}

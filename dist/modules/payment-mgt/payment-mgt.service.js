var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentMgtService_1;
import { Injectable, InternalServerErrorException, Logger, HttpStatus, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { payoutConfig } from './payout-config';
import { PaymentType } from "../../common/enum/payment-type.enum";
let PaymentMgtService = PaymentMgtService_1 = class PaymentMgtService {
    config;
    logger = new Logger(PaymentMgtService_1.name);
    baseUrl;
    secretKey;
    redirectBaseUrl;
    webhookSecretHash;
    constructor(config) {
        this.config = config;
        this.baseUrl = this.config.get('FLW_BASE_URL');
        this.secretKey = this.config.get('FLW_SECRET_KEY');
        this.redirectBaseUrl = this.config.get('FLW_REDIRECT_URL');
        this.webhookSecretHash = this.config.get('FLW_WEBHOOK_HASH');
    }
    async initializePayment(body) {
        try {
            const payload = {
                tx_ref: body.tx_ref,
                amount: body.amount,
                currency: body.currency,
                redirect_url: body.redirect_url,
                payment_options: this.getPaymentOptionsByCountry(body.currency),
                customer: {
                    email: body.customer.email,
                },
                customizations: {
                    title: body.customizations.title,
                    description: body.customizations.description,
                },
            };
            this.logger.debug('Payload being sent to Flutterwave:', payload);
            const response = await axios.post(`${this.baseUrl}/payments`, payload, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.debug('Response received from Flutterwave:', response.data);
            console.log('Response received from Flutterwave:', response.data);
            return response.data;
        }
        catch (error) {
            this.logger.error('Payment initialization failed', {
                message: error?.message,
                data: error?.response?.data,
                status: error?.response?.status,
                headers: error?.response?.headers,
            });
            throw new InternalServerErrorException(error?.response?.data?.message || 'Unable to initialize payment. Try again later.');
        }
    }
    async verifyPayment(tx_ref, paymentType) {
        try {
            const response = await axios.get(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${tx_ref}`, {
                headers: { Authorization: `Bearer ${this.secretKey}` },
            });
            const transaction = response.data?.data;
            if (!transaction) {
                throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
            }
            if (transaction.status !== 'successful') {
                return { status: 'pending', message: 'Payment not completed yet' };
            }
            const totalAmount = Number(transaction.amount);
            const currency = transaction.currency;
            if (paymentType === PaymentType.FUND_WALLET) {
                return {
                    status: 'success',
                    message: 'Payment verified (no payout required for wallet funding)',
                    totalAmount,
                };
            }
            const accounts = payoutConfig[paymentType];
            if (!accounts || accounts.length === 0) {
                throw new HttpException(`No payout config found for paymentType: ${paymentType}`, 400);
            }
            for (const acct of accounts) {
                const payoutAmount = (acct.percentage / 100) * totalAmount;
                await this.initiatePayout({
                    amount: payoutAmount,
                    currency,
                    narration: `${paymentType} payout (${acct.percentage}%) for ${tx_ref}`,
                    bank: acct.bank,
                    account: acct.account,
                });
            }
            return {
                status: 'success',
                message: 'Payment verified and payouts completed',
                totalAmount,
                distributedTo: accounts.length,
            };
        }
        catch (error) {
            throw new InternalServerErrorException(error?.response?.data?.message || 'Unable to verify payment.');
        }
    }
    async initiatePayout(data) {
        try {
            const payload = {
                account_bank: data.bank,
                account_number: data.account,
                amount: Number(data.amount).toFixed(2),
                currency: data.currency,
                narration: data.narration,
                reference: `payout-${Date.now()}`,
            };
            const response = await axios.post(`${this.baseUrl}/transfers`, payload, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data?.status !== 'success') {
                throw new InternalServerErrorException(`Payout failed for account ${data.account}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error('Payout Error', error?.response?.data || error.message);
            throw new InternalServerErrorException('Unable to complete payout.');
        }
    }
    getPaymentOptionsByCountry(currency) {
        const normalizedCurrency = (currency || '').trim().toUpperCase();
        const methods = this.paymentOptionsMap[normalizedCurrency];
        return methods && methods.length > 0
            ? methods
            : [{ code: 'card', label: 'Card Payment' }];
    }
    countryToCurrencyMap = {
        NG: 'NGN',
        GB: 'GBP',
        EU: 'EUR',
        GH: 'GHS',
        RW: 'RWF',
        KE: 'KES',
        ZM: 'ZMW',
        TZ: 'TZS',
        MW: 'MWK',
        XO: 'XOF',
        UG: 'UGX',
        ET: 'ETB',
    };
    paymentOptionsMap = {
        NGN: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'ussd', label: 'USSD Payment' },
            { code: 'barter', label: 'Barter Wallet' },
            { code: 'mpesa', label: 'M-Pesa' },
        ],
        GBP: [
            { code: 'card', label: 'Card Payment' },
            { code: 'account', label: 'UK Bank Transfer' },
        ],
        EUR: [
            { code: 'card', label: 'Card Payment' },
            { code: 'account', label: 'SEPA Bank Transfer' },
            { code: 'ach', label: 'ACH Transfer' },
        ],
        GHS: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyghana', label: 'Mobile Money (Ghana)' },
            { code: 'ussd', label: 'USSD Payment' },
            { code: 'barter', label: 'Barter Wallet' },
        ],
        RWF: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyrwanda', label: 'Mobile Money (Rwanda)' },
        ],
        KES: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneykenya', label: 'Mobile Money (Kenya)' },
            { code: 'mpesa', label: 'M-Pesa' },
        ],
        ZMW: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyzambia', label: 'Mobile Money (Zambia)' },
        ],
        TZS: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneytanzania', label: 'Mobile Money (Tanzania)' },
        ],
        MWK: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneymalawi', label: 'Mobile Money (Malawi)' },
        ],
        XOF: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyfrancophone', label: 'Mobile Money (Francophone Africa)' },
        ],
        UGX: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyuganda', label: 'Mobile Money (Uganda)' },
        ],
        ETB: [
            { code: 'card', label: 'Card Payment' },
            { code: 'bank transfer', label: 'Bank Transfer' },
            { code: 'mobilemoneyethiopia', label: 'Mobile Money (Ethiopia)' },
        ],
    };
    payoutOptionsMap = {
        NGN: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'barter', label: 'Barter Wallet' }
        ],
        GBP: [
            { code: 'bank', label: 'UK Bank Transfer' }
        ],
        EUR: [
            { code: 'bank', label: 'SEPA Bank Transfer' }
        ],
        GHS: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyghana', label: 'Mobile Money (Ghana)' }
        ],
        RWF: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyrwanda', label: 'Mobile Money (Rwanda)' }
        ],
        KES: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mpesa', label: 'M-Pesa' },
            { code: 'mobilemoneykenya', label: 'Mobile Money (Kenya)' }
        ],
        ZMW: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyzambia', label: 'Mobile Money (Zambia)' }
        ],
        TZS: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneytanzania', label: 'Mobile Money (Tanzania)' }
        ],
        MWK: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneymalawi', label: 'Mobile Money (Malawi)' }
        ],
        XOF: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyfrancophone', label: 'Mobile Money (Francophone Africa)' }
        ],
        UGX: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyuganda', label: 'Mobile Money (Uganda)' }
        ],
        ETB: [
            { code: 'bank', label: 'Bank Account' },
            { code: 'mobilemoneyethiopia', label: 'Mobile Money (Ethiopia)' }
        ]
    };
    getPaymentMethodsByCountry(countryCode) {
        const upperCountry = countryCode.trim().toUpperCase();
        const currency = this.countryToCurrencyMap[upperCountry];
        if (!currency) {
            throw new Error(`No currency mapping found for country code: ${countryCode}`);
        }
        const methods = this.paymentOptionsMap[currency];
        if (!methods) {
            throw new Error(`No payment methods found for currency: ${currency}`);
        }
        return { country: upperCountry, currency, methods };
    }
    getPayoutMethodsByCountry(countryCode) {
        const upperCountry = countryCode.trim().toUpperCase();
        const currency = this.countryToCurrencyMap[upperCountry];
        if (!currency) {
            throw new Error(`No currency mapping found for country code: ${countryCode}`);
        }
        const methods = this.payoutOptionsMap[currency];
        if (!methods) {
            throw new Error(`No payout methods found for currency: ${currency}`);
        }
        return { country: upperCountry, currency, methods };
    }
};
PaymentMgtService = PaymentMgtService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], PaymentMgtService);
export { PaymentMgtService };
//# sourceMappingURL=payment-mgt.service.js.map
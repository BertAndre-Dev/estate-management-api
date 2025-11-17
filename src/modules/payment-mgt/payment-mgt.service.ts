import { Injectable, InternalServerErrorException, Logger, HttpStatus, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InitializePaymentDto } from 'src/dto/flutter-wave.dto';
import { payoutConfig } from './payout-config';
import { PaymentType } from 'src/common/enum/payment-type.enum';

@Injectable()
export class PaymentMgtService {
    private readonly logger = new Logger(PaymentMgtService.name);
    private readonly baseUrl: string;
    private readonly secretKey: string;
    private readonly redirectBaseUrl: string;
    private readonly webhookSecretHash: string;

    constructor(private config: ConfigService) {
      this.baseUrl = this.config.get<string>('FLW_BASE_URL')!;
      this.secretKey = this.config.get<string>('FLW_SECRET_KEY')!;
      this.redirectBaseUrl = this.config.get<string>('FLW_REDIRECT_URL')!;
      this.webhookSecretHash = this.config.get<string>('FLW_WEBHOOK_HASH')!;
    }

    


  // initialize payment 
  async initializePayment(body: InitializePaymentDto) {
    try {
      const payload: any = {
        tx_ref: body.tx_ref,
        amount: body.amount,
        currency: body.currency,
        redirect_url: body.redirect_url,
        //payment_options: body.payment_options,
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
    } catch (error) {
      this.logger.error('Payment initialization failed', {
        message: error?.message,
        data: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers,
      });

      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Unable to initialize payment. Try again later.',
      );
    }
  }


  // verify payment
  async verifyPayment(tx_ref: string, paymentType: PaymentType) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${tx_ref}`,
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      );

      const transaction = response.data?.data;
      if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      if (transaction.status !== 'successful') {
        return { status: 'pending', message: 'Payment not completed yet' };
      }

      const totalAmount = Number(transaction.amount);
      const currency = transaction.currency;

      // ✅ If payment was "fundWallet" → skip payout
      if (paymentType === PaymentType.FUND_WALLET) {
        return {
          status: 'success',
          message: 'Payment verified (no payout required for wallet funding)',
          totalAmount,
        };
      }

      // ✅ Otherwise, run payout based on config
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

    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Unable to verify payment.'
      );
    }
  }


  async initiatePayout(data: { amount: number; currency: string; narration: string; bank: string; account: string }) {
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

    } catch (error) {
      this.logger.error('Payout Error', error?.response?.data || error.message);
      throw new InternalServerErrorException('Unable to complete payout.');
    }
  }


  private getPaymentOptionsByCountry(currency: string) {
    const normalizedCurrency = (currency || '').trim().toUpperCase();
    const methods = this.paymentOptionsMap[normalizedCurrency];
    
    return methods && methods.length > 0
      ? methods
      : [{ code: 'card', label: 'Card Payment' }];
  }

  private countryToCurrencyMap: Record<string, string> = {
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

  private paymentOptionsMap = {
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


  private payoutOptionsMap = {
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


  public getPaymentMethodsByCountry(countryCode: string) {
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


  public getPayoutMethodsByCountry(countryCode: string) {
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
}

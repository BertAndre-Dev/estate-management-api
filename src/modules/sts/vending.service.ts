import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SignatureUtil } from 'src/common/utils/signature.utils';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schema/sts/transactions.schema';
import { VendPowerDto } from 'src/dto/vend-power.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class VendingService {
  private readonly baseUrl = process.env.STS_API_URL!;
  private readonly logger = new Logger(VendingService.name);

  private readonly creds = {
    clientId: process.env.STS_CLIENT_ID ?? '',
    terminalId: process.env.STS_TERMINAL_ID ?? '',
    user: process.env.STS_USER ?? '',
    password: process.env.STS_PASS ?? '',
    userKey: process.env.STS_KEY ?? '',
    payType: '85',
  };

  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
    @InjectModel(Transaction.name) private readonly txModel: Model<Transaction>,
  ) {}

  /**
   * 🔋 Vend Power to a Meter
   */
  async vendPower(dto: VendPowerDto) {
    try {
      const token = await this.authService.getAuthToken();
      const seed = this.generateSeed();
      const transId = uuid().replace(/-/g, '').slice(0, 16);

      // ✅ Correctly derive the key (4 args)
      const derivedKey = SignatureUtil.deriveKey(
        this.creds.user,
        this.creds.password,
        this.creds.userKey,
        seed,
      );

      const payload = {
        version: '1',
        clientId: this.creds.clientId,
        terminalId: this.creds.terminalId,
        tokenName: 'Authorization',
        tokenValue: token,
        requestTime: this.formatUtcDateTime(),
        seed,
        transId,
        device: dto.meterNumber,
        amount: String(dto.amount),
        payType: this.creds.payType,
        amountType: 0,
      };

      const sign = SignatureUtil.generateSignature(payload, derivedKey);
      const body = { ...payload, sign, signType: 'MD5' };

      this.logger.debug('🧾 Vending Payload:', JSON.stringify(body, null, 2));
      this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/creditVend`);

      const { data } = await firstValueFrom(
        this.http.post(`${this.baseUrl}/creditVend`, body),
      );

      this.logger.debug('📦 Vending Response:', JSON.stringify(data, null, 2));

      await this.txModel.create({
        meterNumber: dto.meterNumber,
        amount: dto.amount,
        token: data?.tokenNo || data?.energyList?.[0]?.token || '',
        receiptNo: data?.receiptNo || '',
        transId,
        status: data.state === 0 ? 'success' : 'failed',
      });

      if (data.state !== 0) {
        throw new BadRequestException(data.message || 'Vending failed.');
      }

      return {
        success: true,
        message: 'Vend successful',
        data,
      };
    } catch (error) {
      this.logger.error(`Vend error: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * 🧮 Generate 16-digit seed
   */
  private generateSeed(): string {
    return String(Date.now()).padStart(16, '0');
  }

  /**
   * 🕒 Format UTC DateTime (YYYY-MM-DD HH:mm:ss)
   */
  private formatUtcDateTime(date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

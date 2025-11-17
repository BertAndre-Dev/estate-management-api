import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SignatureUtil } from 'src/common/utils/signature.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly baseUrl: string;
  private readonly creds: {
    clientId: string;
    terminalId: string;
    user: string;
    password: string;
    userKey: string;
  };

  constructor(private http: HttpService) {
    this.baseUrl = this.requireEnv('STS_API_URL');
    this.creds = {
      clientId: this.requireEnv('STS_CLIENT_ID'),
      terminalId: this.requireEnv('STS_TERMINAL_ID'),
      user: this.requireEnv('STS_USER'),
      password: this.requireEnv('STS_PASS'),
      userKey: this.requireEnv('STS_KEY'),
    };
  }

  private requireEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing required env var: ${key}`);
    return val;
  }

  /**
   * Format UTC date-time as `yyyy-MM-dd HH:mm:ss`
   * (STS spec format requirement)
   */
  private formatUtcDateTime(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Generate a random 16-digit seed string
   * per STS section “Generate random number algorithm”.
   */
  private generateSeed(): string {
    const rand = Math.floor(Math.random() * 1e16);
    return rand.toString().padStart(16, '0');
  }

  /**
   * 🔐 Get STS Auth Token
   * Complies with:
   *  - Signature Algorithm 1.0.5.230120
   *  - JSON API Spec 1.0.5.240301
   */
  async getAuthToken(): Promise<string> {
    try {
      const seed = this.generateSeed();
      const key = SignatureUtil.deriveKey(
        this.creds.user,
        this.creds.password,
        this.creds.userKey,
        seed,
      );

      // Base payload per STS docs
      const payload = {
        version: 1,
        clientId: this.creds.clientId,
        terminalId: this.creds.terminalId,
        requestTime: this.formatUtcDateTime(),
        user: this.creds.user,
        seed,
      };

      // Generate sign using updated spec (MD5 lowercase)
      const sign = SignatureUtil.generateSignature(payload, key);
      const body = { ...payload, sign, signType: 'MD5' };

      this.logger.debug('🧾 Auth Payload: ' + JSON.stringify(body, null, 2));
      this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/authToken`);

      const { data } = await firstValueFrom(
        this.http.post(`${this.baseUrl}/authToken`, body, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      this.logger.debug(`📩 Auth Response: ${JSON.stringify(data)}`);

      if (!data || data.state !== 0) {
        throw new BadRequestException(
          `Auth failed: ${data?.message || 'Unknown error'}`,
        );
      }

      return data.tokenValue;
    } catch (error) {
      this.logger.error('Auth token fetch failed:', error);
      throw new BadRequestException(error.message);
    }
  }
}

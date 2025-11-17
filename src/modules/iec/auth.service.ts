// src/iec/auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { IecClientService } from './iec-client.service';

@Injectable()
export class IecAuthService {
  private readonly logger = new Logger(IecAuthService.name);

  constructor(private readonly iecClient: IecClientService) {}

  async getToken() {
    const payload = {
      'm:GetUserToken': {
        'm:UserID': process.env.HES_USER || '',
        'm:Password': process.env.HES_PASS || '',
      },
    };

    this.logger.log('Requesting HES GetUserToken');
    const resp = await (this.iecClient as any).postRequest('GetUserToken', payload);
    // Token may come back in immediate response or via async callback; handle both cases in your flow.
    return resp;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { buildRequestMessage, parseResponse } from 'src/common/utils/iec-xml.utils';
import { createHeader } from 'src/common/utils/header.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingRequest, PendingRequestDocument } from 'src/schema/ice/pending-request.schema';

@Injectable()
export class IecClientService {
  private readonly logger = new Logger(IecClientService.name);
  private baseUrl = process.env.HES_BASE_URL!;

  private hesToken: string | null = null;
  private hesTokenFetchedAt: number = 0;
  private TOKEN_TTL = 1000 * 60 * 50; // 50 minutes (HES token valid for 1 hr)

  constructor(
    @InjectModel(PendingRequest.name)
    private pendingModel: Model<PendingRequestDocument>,
  ) {}

  /**
   * PRIVATE: Get & auto-cache token
   */
  private async getToken(): Promise<string> {
    const now = Date.now();

    // Token still valid?
    if (this.hesToken && now - this.hesTokenFetchedAt < this.TOKEN_TTL) {
      return this.hesToken;
    }

    // Fetch new token
    const payload = {
      'm:GetUserToken': {
        'm:UserID': process.env.HES_USER,
        'm:Password': process.env.HES_PASS,
      },
    };

    const resp = await this.postRequest('GetUserToken', payload);
    const ack: any = resp?.ack;
    const token = ack?.Payload?.tokenValue ?? ack?.Reply?.tokenValue;

    this.hesToken = token;
    this.hesTokenFetchedAt = now;

    this.logger.log(`🔐 New HES token acquired`);
    return this.hesToken!;
  }

  /**
   * Correct IEC Verb Rules (from spec)
   */
  private resolveVerb(noun: string): 'get' | 'create' {
    switch (noun) {
      case 'GetUserToken':
      case 'EndDeviceControls':
        return 'create';
      default:
        return 'get';
    }
  }

  /**
   * Generic IEC Request Sender
   */
  private async postRequest(noun: string, payload: any, authToken?: string) {
    const verb = this.resolveVerb(noun);

    const header = createHeader({
      verb,
      noun,
      asyncReply: true,
      replyAddress: process.env.HES_CALLBACK_URL,
      authorization: authToken,
    });

    const xml = buildRequestMessage(header, payload);

    await this.pendingModel.create({
      messageId: header.MessageID,
      noun,
      payload,
      status: 'pending',
      correlationId: header.CorrelationID,
      replyAddress: header.ReplyAddress,
    });

    const resp = await axios.post(this.baseUrl, xml, {
      headers: { 'Content-Type': 'application/xml', Accept: 'application/xml' },
      validateStatus: () => true,
      timeout: Number(process.env.HES_TIMEOUT || 15000),
    });

    let ack = null;
    try {
      ack = parseResponse(resp.data);
    } catch (err) {
      this.logger.warn('Could not parse immediate ACK XML');
    }

    return {
      noun,
      messageId: header.MessageID,
      correlationId: header.CorrelationID,
      ack,
      raw: resp.data,
      status: resp.status,
    };
  }

  // -------------------------------------------------------------------
  //              SMART METER OPERATIONS (TOKEN AUTO-INJECTED)
  // -------------------------------------------------------------------

  async getMeterReadings(meterNumber: string, obis: string) {
    const token = await this.getToken();

    const payload = {
      'm:GetMeterReadings': {
        'm:EndDevice': { 'm:mRID': meterNumber },
        'm:ReadingType': {
          'm:Names': {
            'm:name': obis,
            'm:NameType': { 'm:name': 'ReadingType' },
          },
        },
      },
    };

    return this.postRequest('MeterReadings', payload, token);
  }

  async disconnectMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      'm:EndDeviceControls': {
        'm:EndDeviceControl': {
          'm:reason': 'Disconnect',
          'm:EndDeviceControlType': { '@_ref': '3.0.211.23' },
          'm:EndDevices': {
            'm:mRID': meterNumber,
            'm:Names': {
              'm:name': 'DisConnect',
              'm:NameType': { 'm:name': 'ControlType' },
            },
          },
        },
      },
    };

    return this.postRequest('EndDeviceControls', payload, token);
  }

  async reconnectMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      'm:EndDeviceControls': {
        'm:EndDeviceControl': {
          'm:reason': 'Reconnect',
          'm:EndDeviceControlType': { '@_ref': '3.0.211.23' },
          'm:EndDevices': {
            'm:mRID': meterNumber,
            'm:Names': {
              'm:name': 'ReConnect',
              'm:NameType': { 'm:name': 'ControlType' },
            },
          },
        },
      },
    };

    return this.postRequest('EndDeviceControls', payload, token);
  }

  async getHistoryData(meterNumber: string, dTypeID: string, start: string, end: string) {
    const token = await this.getToken();

    const payload = {
      'm:HistoryDataMeter': {
        'm:page': { 'm:pageSize': 100, 'm:pageNum': 1 },
        'm:mRID': meterNumber,
        'm:dTypeID': dTypeID,
        'm:sTime': start,
        'm:eTime': end,
      },
    };

    return this.postRequest('HistoryDataMeter', payload, token);
  }

  async pageMeters() {
    const token = await this.getToken();

    const payload = {
      'm:PageMeters': {
        'm:page': {
          'm:pageSize': Number(process.env.HES_PAGE_SIZE || 100),
          'm:pageNum': 1,
        },
      },
    };

    return this.postRequest('PageMeters', payload, token);
  }

  async detailsMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      'm:DetailsMeter': {
        'm:mRID': meterNumber,
      },
    };

   return this.postRequest('DetailsMeter', payload, token);
  }
}

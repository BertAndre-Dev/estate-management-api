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

  /**
   * FINAL VERIFIED ENDPOINT:
   * https://energy.verycotech.com/basic-api/hes/api/v1/iec61968/request
   */
  private baseUrl = `${process.env.HES_BASE_URL}`;

  private hesToken: string | null = null;
  private hesTokenFetchedAt = 0;
  private TOKEN_TTL = 1000 * 60 * 50; // 50 minutes

  constructor(
    @InjectModel(PendingRequest.name)
    private pendingModel: Model<PendingRequestDocument>,
  ) {}

  // -------------------------------------------------------
  // TOKEN HANDLING
  // -------------------------------------------------------

  public async getToken(): Promise<string> {
    const now = Date.now();

    if (this.hesToken && now - this.hesTokenFetchedAt < this.TOKEN_TTL) {
      return this.hesToken;
    }

    const payload = {
      "m:GetUserToken": {
        UserID: process.env.HES_USER,
        Password: process.env.HES_PASS,
      },
    };


  const resp = await this.postRequest('GetUserToken', payload);

  const ack: any = resp?.ack;

  // IEC SPEC — Token ALWAYS comes from:
  // <Payload><m:GetUserToken><m:Authorization>VALUE</m:Authorization>
  const token = ack?.ResponseMessage?.Payload?.['m:GetUserToken']?.['m:Authorization'];

  if (!token) {
    this.logger.error('❌ Failed to extract token from GetUserToken response');
    throw new Error('Token extraction failed');
  }

  this.hesToken = token;
  this.hesTokenFetchedAt = now;

    this.logger.log(`🔐 New HES Token acquired successfully`);
    return token;
  }

  // -------------------------------------------------------
  // IEC VERB RULES
  // -------------------------------------------------------

  private resolveVerb(noun: string): 'get' | 'create' {
    if (noun === 'EndDeviceControls') return 'create';
    return 'get';
  }

  // -------------------------------------------------------
  // GENERIC IEC XML REQUEST SENDER
  // -------------------------------------------------------

  private async postRequest(noun: string, payload: any, authToken?: string) {
    const verb = this.resolveVerb(noun);

    const header = createHeader({
      verb,
      noun,
      // Only create => async reply enabled
      asyncReply: verb === 'create',
      replyAddress: process.env.HES_CALLBACK_URL,
      authorization: authToken, // IMPORTANT: you confirmed this works
    });

    const xml = buildRequestMessage(header)(payload);

    this.logger.debug(`📤 Sending IEC XML → HES:\n${xml}`);

    // Save pending request for async callback correlation
    await this.pendingModel.create({
      messageId: header.MessageID,
      noun,
      payload,
      status: 'pending',
      correlationId: header.CorrelationID,
      replyAddress: header.ReplyAddress,
    });

    const resp = await axios.post(this.baseUrl, xml, {
      headers: {
        'Content-Type': 'application/xml',
        Accept: 'application/xml',
      },
      timeout: Number(process.env.HES_TIMEOUT || 20000),
      validateStatus: () => true,
    });

    this.logger.debug(`📥 HES Immediate Response (${resp.status}):\n${resp.data}`);

    let ack = null;
    try {
      ack = parseResponse(resp.data);
    } catch {
      this.logger.warn('⚠ Could not parse ACK from HES');
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

  // -------------------------------------------------------
  // SMART METER OPERATIONS
  // -------------------------------------------------------

  async disconnectMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      "m:EndDeviceControls": {
        "m:EndDeviceControl": {
          "m:reason": "Disconnect/Reconnect",
          "m:EndDeviceControlType": {
            "@_ref": "3.0.211.23"
          },
          "m:EndDevices": {
            "m:mRID": meterNumber,
            "m:Names": {
              "m:name": "DisConnect",
              "m:NameType": {
                "m:name": "ControlType"
              }
            }
          }
        }
      }
    };



    return this.postRequest('EndDeviceControls', payload, token);
  };

  async reconnectMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      "m:EndDeviceControls": {
        "m:EndDeviceControl": {
          "m:reason": "Disconnect/Reconnect",
          "m:EndDeviceControlType": {
            "@_ref": "3.0.211.23"
          },
          "m:EndDevices": {
            "m:mRID": meterNumber,
            "m:Names": {
              "m:name": "Reconnect",
              "m:NameType": {
                "m:name": "ControlType"
              }
            }
          }
        }
      }
    };

    return this.postRequest('EndDeviceControls', payload, token);
  };

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

    return this.postRequest('GetMeterReadings', payload, token);
  };

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
  };

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
  };

  async sendToken(meterNumber: string, tokenValue: string) {
    const token = await this.getToken();

    const payload = {
      'm:EndDeviceControls': {
        'm:EndDeviceControl': {
          'm:reason': 'sendTokens',
          'm:EndDeviceControlType': { '@_ref': '15.13.112.78' },
          'm:EndDevices': {
            'm:mRID': meterNumber,
            'm:Names': {
              'm:name': tokenValue
            }
          }
        }
      }
    };

    return this.postRequest('EndDeviceControls', payload, token);
  };


  async detailsMeter(meterNumber: string) {
    const token = await this.getToken();

    const payload = {
      'm:DetailsMeter': {
        'm:mRID': meterNumber,
      },
    };

    return this.postRequest('DetailsMeter', payload, token);
  };


  /**
   * 🔍 Read a specific OBIS value (ReadData)
   */
  async readData(meterNumber: string, dTypeID: string) {
    const token = await this.getToken();

    const payload = {
      "m:ReadData": {
        "m:mRID": meterNumber,
        "m:dTypeID": dTypeID,
      },
    };

    return this.postRequest("ReadData", payload, token);
  }

  /**
   * Extract the OBIS with a matching name
   */
  extractObis(details: any, match: string) {
    const types =
      details.ack.ResponseMessage.Payload["m:DetailsMeter"]["m:dataTypes"]["m:dataType"];

    return types.find(t =>
      t["m:dTypeName"].toLowerCase().includes(match.toLowerCase())
    );
  }
}

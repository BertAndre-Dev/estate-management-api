var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IecClientService_1;
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { buildRequestMessage, parseResponse } from "../../common/utils/iec-xml.utils";
import { createHeader } from "../../common/utils/header.utils";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingRequest } from "../../schema/ice/pending-request.schema";
let IecClientService = IecClientService_1 = class IecClientService {
    pendingModel;
    logger = new Logger(IecClientService_1.name);
    baseUrl = `${process.env.HES_BASE_URL}`;
    hesToken = null;
    hesTokenFetchedAt = 0;
    TOKEN_TTL = 1000 * 60 * 50;
    constructor(pendingModel) {
        this.pendingModel = pendingModel;
    }
    async getToken() {
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
        const ack = resp?.ack;
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
    resolveVerb(noun) {
        if (noun === 'EndDeviceControls')
            return 'create';
        return 'get';
    }
    async postRequest(noun, payload, authToken) {
        const verb = this.resolveVerb(noun);
        const header = createHeader({
            verb,
            noun,
            asyncReply: verb === 'create',
            replyAddress: process.env.HES_CALLBACK_URL,
            authorization: authToken,
        });
        const xml = buildRequestMessage(header)(payload);
        this.logger.debug(`📤 Sending IEC XML → HES:\n${xml}`);
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
        }
        catch {
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
    async disconnectMeter(meterNumber) {
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
    }
    ;
    async reconnectMeter(meterNumber) {
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
    }
    ;
    async getMeterReadings(meterNumber, obis) {
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
    }
    ;
    async getHistoryData(meterNumber, dTypeID, start, end) {
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
    ;
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
    ;
    async sendToken(meterNumber, tokenValue) {
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
    }
    ;
    async detailsMeter(meterNumber) {
        const token = await this.getToken();
        const payload = {
            'm:DetailsMeter': {
                'm:mRID': meterNumber,
            },
        };
        return this.postRequest('DetailsMeter', payload, token);
    }
};
IecClientService = IecClientService_1 = __decorate([
    Injectable(),
    __param(0, InjectModel(PendingRequest.name)),
    __metadata("design:paramtypes", [Model])
], IecClientService);
export { IecClientService };
//# sourceMappingURL=iec-client.service.js.map
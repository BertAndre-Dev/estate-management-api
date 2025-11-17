"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IecClientService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const iec_xml_utils_1 = require("../../common/utils/iec-xml.utils");
const header_utils_1 = require("../../common/utils/header.utils");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pending_request_schema_1 = require("../../schema/ice/pending-request.schema");
let IecClientService = IecClientService_1 = class IecClientService {
    pendingModel;
    logger = new common_1.Logger(IecClientService_1.name);
    baseUrl = process.env.HES_BASE_URL;
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
            'm:GetUserToken': {
                'm:UserID': process.env.HES_USER,
                'm:Password': process.env.HES_PASS,
            },
        };
        const resp = await this.postRequest('GetUserToken', payload);
        const ack = resp?.ack;
        const token = ack?.Payload?.tokenValue ?? ack?.Reply?.tokenValue;
        this.hesToken = token;
        this.hesTokenFetchedAt = now;
        this.logger.log(`🔐 New HES token acquired`);
        return this.hesToken;
    }
    resolveVerb(noun) {
        switch (noun) {
            case 'GetUserToken':
            case 'EndDeviceControls':
                return 'create';
            default:
                return 'get';
        }
    }
    async postRequest(noun, payload, authToken) {
        const verb = this.resolveVerb(noun);
        const header = (0, header_utils_1.createHeader)({
            verb,
            noun,
            asyncReply: true,
            replyAddress: process.env.HES_CALLBACK_URL,
            authorization: authToken,
        });
        const xml = (0, iec_xml_utils_1.buildRequestMessage)(header, payload);
        await this.pendingModel.create({
            messageId: header.MessageID,
            noun,
            payload,
            status: 'pending',
            correlationId: header.CorrelationID,
            replyAddress: header.ReplyAddress,
        });
        const resp = await axios_1.default.post(this.baseUrl, xml, {
            headers: { 'Content-Type': 'application/xml', Accept: 'application/xml' },
            validateStatus: () => true,
            timeout: Number(process.env.HES_TIMEOUT || 15000),
        });
        let ack = null;
        try {
            ack = (0, iec_xml_utils_1.parseResponse)(resp.data);
        }
        catch (err) {
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
        return this.postRequest('MeterReadings', payload, token);
    }
    async disconnectMeter(meterNumber) {
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
    async reconnectMeter(meterNumber) {
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
exports.IecClientService = IecClientService;
exports.IecClientService = IecClientService = IecClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pending_request_schema_1.PendingRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IecClientService);
//# sourceMappingURL=iec-client.service.js.map
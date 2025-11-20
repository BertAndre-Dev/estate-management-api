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
var IecCallbackController_1;
import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { parseResponse } from "../../common/utils/iec-xml.utils";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingRequest } from "../../schema/ice/pending-request.schema";
import { MeterReading } from "../../schema/meter-mgt/meter-reading.schema";
import { ObisService } from "../../common/obis/obis.service";
let IecCallbackController = IecCallbackController_1 = class IecCallbackController {
    pendingModel;
    readingModel;
    obis;
    logger = new Logger(IecCallbackController_1.name);
    constructor(pendingModel, readingModel, obis) {
        this.pendingModel = pendingModel;
        this.readingModel = readingModel;
        this.obis = obis;
    }
    async receive(req, res) {
        const rawXml = typeof req.body === 'string' ? req.body : req.rawBody || null;
        if (!rawXml) {
            this.logger.warn('No XML received on IEC callback');
            return res.status(400).send('No XML payload');
        }
        this.logger.log('IEC callback received — parsing XML');
        let parsed;
        try {
            parsed = parseResponse(rawXml);
        }
        catch (e) {
            this.logger.error('Failed to parse IEC XML', e);
            return res.status(400).send('Invalid XML');
        }
        const response = parsed.ResponseMessage || parsed['ns:ResponseMessage'] || parsed;
        const header = response?.Header || response?.['ns:Header'];
        const payload = response?.Payload || response?.['ns:Payload'];
        const reply = response?.Reply || response?.['ns:Reply'];
        const messageId = header?.CorrelationID || header?.MessageID || header?.['@_MessageID'] || null;
        if (messageId) {
            await this.pendingModel.findOneAndUpdate({ messageId }, { status: 'received' }).exec();
        }
        try {
            const meterReadings = payload?.['m:MeterReadings'] ||
                payload?.MeterReadings ||
                reply?.['m:MeterReadings'] ||
                reply?.MeterReadings;
            if (meterReadings) {
                const records = meterReadings['m:MeterReading'] ||
                    meterReadings.MeterReading ||
                    meterReadings;
                const arr = Array.isArray(records) ? records : [records];
                for (const rec of arr) {
                    const meterNode = rec?.Meter || rec?.['m:Meter'] || {};
                    const mRID = meterNode?.['m:mRID'] ||
                        meterNode?.mRID ||
                        meterNode?.['@_mRID'];
                    const readingsNode = rec?.Readings || rec?.['m:Readings'] || {};
                    const readingTypeNode = readingsNode?.ReadingType ||
                        readingsNode?.['m:ReadingType'];
                    const obis = readingTypeNode?.['@_ref'] ||
                        readingTypeNode?.ref ||
                        (typeof readingTypeNode === 'string' ? readingTypeNode : null);
                    const value = readingsNode?.['m:value'] ||
                        readingsNode?.value ||
                        readingsNode?._value;
                    const ts = readingsNode?.['m:timeStamp'] ||
                        readingsNode?.timeStamp ||
                        new Date().toISOString();
                    const meta = this.obis.transformReading(obis, value);
                    await this.readingModel.create({
                        meterNumber: mRID,
                        obis: meta.obis,
                        name: meta.name,
                        category: meta.category,
                        value: meta.value,
                        unit: meta.unit,
                        timestamp: new Date(ts),
                        source: 'HES',
                        raw: readingsNode,
                    });
                }
            }
        }
        catch (err) {
            this.logger.error('Error processing MeterReadings payload', err);
        }
        const ackXml = `<?xml version="1.0" encoding="UTF-8"?>
    <ResponseMessage xmlns="http://iec.ch/TC57/2011/schema/message">
      <Header>
        <Verb>reply</Verb>
        <Noun>CallbackAck</Noun>
        <Timestamp>${new Date().toISOString()}</Timestamp>
        <Source>MDM</Source>
        <AsyncReplyFlag>false</AsyncReplyFlag>
        <MessageID>${messageId ?? 'UNKNOWN'}</MessageID>
        <CorrelationID>${messageId ?? 'UNKNOWN'}</CorrelationID>
        <Revision>2</Revision>
      </Header>
      <Reply>
        <Result>OK</Result>
        <Error><code>0.0</code></Error>
      </Reply>
    </ResponseMessage>`;
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(ackXml);
    }
};
__decorate([
    Post('callback'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IecCallbackController.prototype, "receive", null);
IecCallbackController = IecCallbackController_1 = __decorate([
    Controller('iec'),
    __param(0, InjectModel(PendingRequest.name)),
    __param(1, InjectModel(MeterReading.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        ObisService])
], IecCallbackController);
export { IecCallbackController };
//# sourceMappingURL=iec-callback.controller.js.map
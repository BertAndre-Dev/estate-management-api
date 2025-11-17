// src/iec/iec-callback.controller.ts
import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { parseResponse } from 'src/common/utils/iec-xml.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingRequest, PendingRequestDocument } from 'src/schema/ice/pending-request.schema';
import { MeterReading, MeterReadingDocument } from 'src/schema/meter-mgt/meter-reading.schema';
import { ObisService } from 'src/common/obis/obis.service';

@Controller('iec')
export class IecCallbackController {
  private readonly logger = new Logger(IecCallbackController.name);

  constructor(
    @InjectModel(PendingRequest.name)
    private pendingModel: Model<PendingRequestDocument>,

    @InjectModel(MeterReading.name)
    private readingModel: Model<MeterReadingDocument>,

    private obis: ObisService,
  ) {}

  /**
   * This endpoint receives async ResponseMessage XML from HES.
   * Ensure your main.ts config leaves raw XML body as `req.body` text.
   */
  @Post('callback')
  async receive(@Req() req: Request & { rawBody?: string }, @Res() res: Response) {
    const rawXml = typeof req.body === 'string' ? req.body : (req.rawBody as string) || null;

    if (!rawXml) {
      this.logger.warn('No XML received on IEC callback');
      return res.status(400).send('No XML payload');
    }

    this.logger.log('IEC callback received — parsing XML');
    let parsed: any;
    try {
      parsed = parseResponse(rawXml);
    } catch (e) {
      this.logger.error('Failed to parse IEC XML', e);
      return res.status(400).send('Invalid XML');
    }

    // ResponseMessage may be namespaced or not; try to find Header/Payload
    const response = parsed.ResponseMessage || parsed['ns:ResponseMessage'] || parsed;
    const header = response?.Header || response?.['ns:Header'];
    const payload = response?.Payload || response?.['ns:Payload'];
    const reply = response?.Reply || response?.['ns:Reply'];

    const messageId = header?.CorrelationID || header?.MessageID || header?.['@_MessageID'] || null;

    if (messageId) {
      await this.pendingModel.findOneAndUpdate({ messageId }, { status: 'received' }).exec();
    }

    // Handle MeterReadings payloads
    try {
      // MeterReadings may be under payload['m:MeterReadings'] or payload.MeterReadings
      const meterReadings = payload?.['m:MeterReadings'] || payload?.MeterReadings;
      if (meterReadings) {
        // normalize to array
        const records = meterReadings['m:MeterReading'] || meterReadings.MeterReading || meterReadings;
        const arr = Array.isArray(records) ? records : [records];

        for (const rec of arr) {
          const meterNode = rec?.Meter || rec?.['m:Meter'] || {};
          const readingsNode = rec?.Readings || rec?.['m:Readings'] || {};

          const mRID = meterNode?.['m:mRID'] || meterNode?.mRID || meterNode?.mRID || meterNode?.['@_mRID'];
          // reading fields
          const readingTypeNode = readingsNode?.ReadingType || readingsNode?.['m:ReadingType'];
          const obis =
            readingTypeNode?.['@_ref'] ||
            readingTypeNode?.ref ||
            readingTypeNode?.['@_ref'] ||
            (readingTypeNode && typeof readingTypeNode === 'string' ? readingTypeNode : null);

          const value =
            Number(readingsNode?.value ?? readingsNode?.['m:value'] ?? readingsNode?.['m:value'] ?? NaN) ||
            (readingsNode?.['m:value'] ?? readingsNode?.value);

          const ts =
            readingsNode?.timeStamp ||
            readingsNode?.['m:timeStamp'] ||
            readingsNode?.['m:timeStamp'] ||
            readingsNode?.timeStamp ||
            new Date().toISOString();

          await this.readingModel.create({
            meterNumber: mRID,
            obis,
            value: isNaN(Number(value)) ? value : Number(value),
            timestamp: new Date(ts),
            source: 'HES',
            raw: readingsNode,
          });
        }
      }
    } catch (err) {
      this.logger.error('Error processing MeterReadings payload', err);
    }

    // You can add handling for EndDeviceControls reply, HistoryDataMeter payload, PageMeters, DetailsMeter, etc.

    // Send back an ACK response (simple)
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
}

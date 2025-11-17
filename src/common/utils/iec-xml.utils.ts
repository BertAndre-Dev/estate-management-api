// src/common/utils/iec-xml.util.ts
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
  attributeNamePrefix: '@_',
});

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  trimValues: true,
});

/**
 * Build a RequestMessage XML document per IEC 61968.
 * header: object representing Header node
 * payload: object representing Request node contents (e.g. { 'm:GetMeterReadings': {...} })
 */
export function buildRequestMessage(header: any, payload: any): string {
  const envelope = {
    RequestMessage: {
      '@_xmlns': 'http://iec.ch/TC57/2011/schema/message',
      Header: header,
      Request: payload,
    },
  };
  return builder.build(envelope);
}

/**
 * Parse an IEC XML response into JS object.
 */
export function parseResponse(xml: string): any {
  return parser.parse(xml);
}

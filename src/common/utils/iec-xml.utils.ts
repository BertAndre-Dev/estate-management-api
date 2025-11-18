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
 * Namespace map depending on the IEC operation
 */
const IEC_NAMESPACES: Record<string, string> = {
  GetUserToken: 'http://iec.ch/TC57/2011/GetMeterReadings#',
  EndDeviceControls: 'http://iec.ch/TC57/2011/EndDeviceControls#',
};

/**
 * Wrapper element per Noun
 */
const IEC_WRAPPER: Record<string, 'Request' | 'Payload'> = {
  GetUserToken: 'Request',
  DetailsMeter: 'Request',       // REQUIRED
  GetMeterReadings: 'Request',
  EndDeviceControls: 'Payload',  // ONLY this uses Payload
};


/**
 * Build a RequestMessage XML for any IEC 61968 operation.
 */
export function buildRequestMessage(header: any): (payload: any) => string {
  const noun = header?.Noun;
  const namespace =
    IEC_NAMESPACES[noun] ||
    'http://iec.ch/TC57/2011/GetMeterReadings#'; // default fallback

  const wrapper = IEC_WRAPPER[noun] || 'Payload';

  return (payload: any) => {
    const envelope: any = {
      RequestMessage: {
        '@_xmlns': 'http://iec.ch/TC57/2011/schema/message',
        '@_xmlns:m': namespace,
        '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@_xsi:schemaLocation':
          'http://iec.ch/TC57/2011/schema/message Message.xsd',

        Header: header,
      },
    };

    // Inject the appropriate wrapper (<Request> or <Payload>)
    envelope.RequestMessage[wrapper] = payload;

    return builder.build(envelope);
  };
}

/**
 * Parse an IEC XML response into a JS object.
 */
export function parseResponse(xml: string): any {
  return parser.parse(xml);
}

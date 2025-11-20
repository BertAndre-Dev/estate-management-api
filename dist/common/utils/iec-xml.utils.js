"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRequestMessage = buildRequestMessage;
exports.parseResponse = parseResponse;
const fast_xml_parser_1 = require("fast-xml-parser");
const builder = new fast_xml_parser_1.XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: '@_',
});
const parser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
    trimValues: true,
});
const IEC_NAMESPACES = {
    GetUserToken: 'http://iec.ch/TC57/2011/GetMeterReadings#',
    EndDeviceControls: 'http://iec.ch/TC57/2011/EndDeviceControls#',
};
const IEC_WRAPPER = {
    GetUserToken: 'Request',
    DetailsMeter: 'Request',
    GetMeterReadings: 'Request',
    EndDeviceControls: 'Payload',
};
function buildRequestMessage(header) {
    const noun = header?.Noun;
    const namespace = IEC_NAMESPACES[noun] ||
        'http://iec.ch/TC57/2011/GetMeterReadings#';
    const wrapper = IEC_WRAPPER[noun] || 'Payload';
    return (payload) => {
        const envelope = {
            RequestMessage: {
                '@_xmlns': 'http://iec.ch/TC57/2011/schema/message',
                '@_xmlns:m': namespace,
                '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@_xsi:schemaLocation': 'http://iec.ch/TC57/2011/schema/message Message.xsd',
                Header: header,
            },
        };
        envelope.RequestMessage[wrapper] = payload;
        return builder.build(envelope);
    };
}
function parseResponse(xml) {
    return parser.parse(xml);
}
//# sourceMappingURL=iec-xml.utils.js.map
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
function buildRequestMessage(header, payload) {
    const envelope = {
        RequestMessage: {
            '@_xmlns': 'http://iec.ch/TC57/2011/schema/message',
            Header: header,
            Request: payload,
        },
    };
    return builder.build(envelope);
}
function parseResponse(xml) {
    return parser.parse(xml);
}
//# sourceMappingURL=iec-xml.utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeader = createHeader;
const uuid_1 = require("uuid");
function createHeader({ verb, noun, asyncReply = true, replyAddress, authorization, }) {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const messageId = `MSG-${(0, uuid_1.v4)()}`;
    return {
        Verb: verb,
        Noun: noun,
        Timestamp: ts,
        Source: 'MDM',
        AsyncReplyFlag: asyncReply ? 'true' : 'false',
        ReplyAddress: replyAddress || process.env.HES_CALLBACK_URL || '',
        AckRequired: 'true',
        MessageID: messageId,
        CorrelationID: messageId,
        Revision: '2.0',
        Authorization: authorization || '',
    };
}
//# sourceMappingURL=header.utils.js.map
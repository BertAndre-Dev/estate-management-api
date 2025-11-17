// src/common/utils/header.util.ts
import { v4 as uuid } from 'uuid';

export function createHeader({
  verb,
  noun,
  asyncReply = true,
  replyAddress,
  authorization,
}: {
  verb: string;
  noun: string;
  asyncReply?: boolean;
  replyAddress?: string;
  authorization?: string;
}) {
  // Format: "YYYY-MM-DD HH:mm:ss"
  const now = new Date();
  const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0',
  )}:${String(now.getSeconds()).padStart(2, '0')}`;

  const messageId = `MSG-${uuid()}`;
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

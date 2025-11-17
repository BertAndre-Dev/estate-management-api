export declare function createHeader({ verb, noun, asyncReply, replyAddress, authorization, }: {
    verb: string;
    noun: string;
    asyncReply?: boolean;
    replyAddress?: string;
    authorization?: string;
}): {
    Verb: string;
    Noun: string;
    Timestamp: string;
    Source: string;
    AsyncReplyFlag: string;
    ReplyAddress: string;
    AckRequired: string;
    MessageID: string;
    CorrelationID: string;
    Revision: string;
    Authorization: string;
};

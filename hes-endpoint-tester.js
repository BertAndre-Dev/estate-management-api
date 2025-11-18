const axios = require("axios");

// Your FINAL BASE URL
const URL = "https://energy.verycotech.com/basic-api/hes/api/v1/iec61968/request";

// A valid IEC Ping XML (simple test)
const TEST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<RequestMessage xmlns="http://iec.ch/TC57/2011/schema/message">
  <Header>
    <Verb>get</Verb>
    <Noun>Ping</Noun>
    <Timestamp>${new Date().toISOString()}</Timestamp>
    <Source>MDM</Source>
    <AsyncReplyFlag>false</AsyncReplyFlag>
    <MessageID>TEST-${Date.now()}</MessageID>
    <CorrelationID>TEST-${Date.now()}</CorrelationID>
    <Revision>2</Revision>
  </Header>
  <Request></Request>
</RequestMessage>`;

async function test() {
  console.log(`🔍 Testing Base URL: ${URL}\n`);

  try {
    const resp = await axios.post(URL, TEST_XML, {
      headers: { "Content-Type": "application/xml" },
      timeout: 10000,
      validateStatus: () => true,
    });

    console.log("Status:", resp.status);
    console.log(
      "Body:",
      typeof resp.data === "string"
        ? resp.data.substring(0, 300)
        : "(non-string)"
    );
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

test();

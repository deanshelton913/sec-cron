const Parser = require("rss-parser");
const secParser = require("sec-edgar-parser");
const dynamo = require("./dynamoDbClient");
const s3 = require("./s3");
const parser = new Parser();
const sleep = (ms) =>
  new Promise((res, rej) => {
    console.log("Sleeping", ms, "ms");
    setTimeout(() => {
      res();
    }, ms);
  });
  



const main = async (skip = 0, take = 50) => {
  const sleepTimeInMs = 300;
  const url = `https://www.sec.gov/cgi-bin/browse-edgar\?action\=getcurrent\&CIK\=\&type\=\&company\=\&dateb\=\&owner\=include\&start\=${skip}\&count\=${take}\&output\=atom`;
  const userAgent = "SIGILANT  deanshelton913@sigilant.com";
  const xmlFeed = await (
    await fetch(url, { headers: { "user-agent": userAgent } })
  ).text();
  const feed = await parser.parseString(xmlFeed);

  let i = 1;
  for (const item of feed.items) {
    console.log(`${i}/${feed.items.length}`)
    i++;
    const txtLink = item.link.replace("-index.htm", ".txt");
    const textLinkArray = txtLink.split("/");
    const partitionKey = [
      "sec-edgar-archives",
      textLinkArray[6],
      textLinkArray[7],
      textLinkArray[8],
    ]
      .join("/")
      .replace(".txt", ".json");
    const exists = await s3.checkObjectExists(partitionKey)
    if (exists) {
      console.log("Already Fetched:", txtLink, `s3://${s3.bucketName}/${partitionKey}`);
    } else {
      console.log('Fetching document:', txtLink);
      const obj = await secParser.getObjectFromUrl(txtLink);
      const jsonDoc = JSON.stringify(obj, null, 2);
      const rangeKey = obj.acceptanceDateTime;
      await s3.uploadTextToS3(partitionKey, jsonDoc);
      await dynamo.pushToDynamoDB(partitionKey, rangeKey, jsonDoc);
      await sleep(sleepTimeInMs);
    }
    console.log('----------');
  }
};

module.exports = { main }

main()
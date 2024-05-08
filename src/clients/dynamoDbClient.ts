import { DynamoDBClient, PutItemCommand, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
  const client = new DynamoDBClient({ region: "us-west-2" });
  const tableName = "sec-production";
  async function pushToDynamoDB(partitionKey:string, rangeKey:string, jsonString:string) {
    const params = {
      TableName: tableName,
      Item: {
        id: { S: partitionKey },
        acceptanceDateTime: { N: String(rangeKey) },
        JSONDocument: { S: jsonString },
      },
    };
  
    try {
      // Send the PutItem command to DynamoDB
      const command = new PutItemCommand(params);
      const response = await client.send(command);
      console.log("Dynamo Item added successfully:", partitionKey);
      return response;
    } catch (error) {
      console.error("Error adding item to DynamoDB:", error);
      throw error;
    }
  }
  
  async function checkRecordExists(partitionKey:string, rangeKey:string) {
    // Prepare the GetItem command to check if the record exists
    const params = {
      TableName: tableName,
      Key: {
        id: { S: partitionKey },
        acceptanceDateTime: { N: rangeKey },
      },
    };
  
    try {
      // Send the GetItem command to DynamoDB
      const command = new GetItemCommand(params);
      const response = await client.send(command);
  
      // Check if the item exists in the response
      if (response.Item) {
        console.log("Dynamo record exists:", partitionKey);
        return true;
      }
      console.log("Dynamo record does not exist:", partitionKey);
      return false;
    } catch (error) {
      console.error("Error checking record in DynamoDB:", error);
      throw error;
    }
  }
  
  async function getMostRecentValues(count:number) {
    // Prepare the Scan command to retrieve the most recent values
    const params = {
      TableName: "sec-production",
      Limit: count, // Limit the result to the specified count
      ScanIndexForward: false, // Sort in descending order
    };
  
    try {
      // Send the Scan command to DynamoDB
      const command = new ScanCommand(params);
      const response = await client.send(command);
      // Extract the items from the response
      const items = response.Items?.map((item) => {
        return {
          id: item.id.S,
          acceptanceDateTime: item.acceptanceDateTime.N,
        };
      });
  
      return items;
    } catch (error) {
      console.error("Error retrieving most recent values from DynamoDB:", error);
      throw error;
    }
  }
  export { checkRecordExists, pushToDynamoDB, getMostRecentValues };
  
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
const bucketName = "sec-edgar-production";
const client = new S3Client({ region: "us-west-2" }); // Replace "your-region" with your actual AWS region
async function uploadTextToS3(key:string, text:string) {

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: text,
  };

  try {
    // Send the PutObject command to S3
    const command = new PutObjectCommand(params);
    const response = await client.send(command);
    console.log("S3 putObject success:", `s3://${bucketName}/${key}`);
    return response;
  } catch (error) {
    console.error("Error uploading text to S3:", error);
    throw error;
  }
}


async function checkObjectExists(key:string) {
    const params = {
        Bucket: bucketName,
        Key: key
    };

    try {
        // Send the HeadObject command to S3
        const command = new HeadObjectCommand(params);
        await client.send(command);
        console.log(`S3 object exists: ${key}`);
        return true;
    } catch (error) {
      const err: {name:string} = error as unknown as Error
        if (err.name === "NotFound") {
            console.log(`S3 Key does not exist: ${key} `);
            return false;
        }
            console.error("Error checking if object exists in S3:", error);
            throw error;
    }
}


export { uploadTextToS3, checkObjectExists, bucketName };

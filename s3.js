const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = "sec-edgar-production";
const client = new S3Client({ region: "us-west-2" }); // Replace "your-region" with your actual AWS region
async function uploadTextToS3(key, text) {

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


async function checkObjectExists(key) {
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
        if (error.name === "NotFound") {
            console.log(`S3 Key does not exist: ${key} `);
            return false;
        }
            console.error("Error checking if object exists in S3:", error);
            throw error;
    }
}


module.exports = { uploadTextToS3, checkObjectExists, bucketName };

const s3 = require('../s3client');
const { RestoreObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");

async function restoreS3Object(bucketName, keyName) {
    try {
        const restoreRequest = {
            Days: 3,
        };

        const params = {
            Bucket: bucketName,
            Key: keyName,
            RestoreRequest: restoreRequest
        };

        const command = new RestoreObjectCommand(params);
        const response = await s3.send(command);
        console.log("Restore request sent successfully:", response);
        
        await checkRestorationStatus(bucketName, keyName);
    } catch (err) {
        console.error("Error restoring object:", err);
    }
}

async function checkRestorationStatus(bucketName, keyName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        const command = new HeadObjectCommand(params);
        const response = await s3.send(command);

        const restStatus = response.Restore ? "in-progress" : "finished or failed";
        console.log(`Restoration status: ${restStatus}`);
    } catch (err) {
        console.error("Error checking restoration status:", err);
    }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log("Usage: node RestoreObject.js <bucketName> <keyName>");
    process.exit(1);
}

const [bucketName, keyName] = args;
restoreS3Object(bucketName, keyName);

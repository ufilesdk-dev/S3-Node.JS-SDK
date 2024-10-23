const s3 = require('../s3client');
const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");

async function deleteS3Objects(bucketName, objectKeys) {
    try {
        const deleteParams = {
            Bucket: bucketName,
            Delete: {
                Objects: objectKeys.map(key => ({ Key: key }))
            }
        };

        const command = new DeleteObjectsCommand(deleteParams);
        const response = await s3.send(command);
        console.log(`Successfully deleted ${response.Deleted.length} objects from S3 bucket. Deleted objects:`);
        console.log(response.Deleted.map(d => ` • ${d.Key}`).join("\n"));
    } catch (err) {
        console.error("Error deleting objects:", err);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: node DeleteObject.js <bucketName> <objectKey1> <objectKey2> ...");
    process.exit(1);
}

const [bucketName, ...objectKeys] = args;
deleteS3Objects(bucketName, objectKeys);

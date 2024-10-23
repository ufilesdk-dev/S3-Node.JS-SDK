const s3 = require('../s3client');
const { CopyObjectCommand } = require("@aws-sdk/client-s3");

async function copyFile(sourceBucket, sourceKey, destinationBucket, destinationKey) {
    try {
        const copySource = `${sourceBucket}/${sourceKey}`;
        const params = {
            CopySource: copySource,
            Bucket: destinationBucket,
            Key: destinationKey
        };
        const command = new CopyObjectCommand(params);
        const response = await s3.send(command);
        console.log("File copied successfully", response);
        return response;
    } catch (err) {
        console.error("Error copying file", err);
        throw err;
    }
}

const args = process.argv.slice(2);
if (args.length === 4) {
    const [sourceBucket, sourceKey, destinationBucket, destinationKey] = args;
    copyFile(sourceBucket, sourceKey, destinationBucket, destinationKey)
        .then(() => console.log('Copy complete'))
        .catch((err) => console.error('Copy failed', err));
} else {
    console.log("Usage: node PutObjectCopy.js <sourceBucket> <sourceKey> <destinationBucket> <destinationKey>");
}

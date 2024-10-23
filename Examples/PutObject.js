const s3 = require('../s3client');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

async function uploadFile(bucketName, keyName, filePath, storageClass) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: bucketName,
            Key: keyName,
            Body: fileContent
        };
        if (storageClass) {
            params.StorageClass = storageClass;
        }
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log("File uploaded successfully", response);
        return response;
    } catch (err) {
        console.error("Error uploading file", err);
        throw err;
    }
}

const args = process.argv.slice(2);
if (args.length === 4) {
    const [bucketName, keyName, filePath, storageClass] = args;
    uploadFile(bucketName, keyName, filePath, storageClass)
        .then(() => console.log('Upload complete'))
        .catch((err) => console.error('Upload failed', err));
} else if (args.length === 3) {
    const [bucketName, keyName, filePath] = args;
    uploadFile(bucketName, keyName, filePath)
        .then(() => console.log('Upload complete'))
        .catch((err) => console.error('Upload failed', err));
} else {
    console.log("Usage: node PutObject.js <bucketName> <keyName> <filePath> [storageClass]");
}

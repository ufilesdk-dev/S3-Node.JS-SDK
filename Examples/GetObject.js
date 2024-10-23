const s3 = require('../s3client');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');

async function downloadFile(bucketName, keyName, downloadPath) {
    try {
        const params = {
            Bucket: bucketName,
            Key: keyName
        };
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        const stream = response.Body;

        const filePath = path.resolve(downloadPath, keyName);
        const writeStream = fs.createWriteStream(filePath);

        stream.pipe(writeStream);

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log("File downloaded successfully to", filePath);
                resolve(filePath);
            });
            writeStream.on('error', (err) => {
                console.error("Error downloading file", err);
                reject(err);
            });
        });
    } catch (err) {
        console.error("Error downloading file", err);
        throw err;
    }
}

const args = process.argv.slice(2);
if (args.length === 3) {
    const [bucketName, keyName, downloadPath] = args;
    downloadFile(bucketName, keyName, downloadPath)
        .then(() => console.log('Download complete'))
        .catch((err) => console.error('Download failed', err));
} else {
    console.log("Usage: node GetObject.js <bucketName> <keyName> <downloadPath>");
}

module.exports = downloadFile;

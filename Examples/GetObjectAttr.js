const s3 = require('../s3client');
const { HeadObjectCommand } = require("@aws-sdk/client-s3");

async function getObjectAttributes(bucketName, keyName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        const command = new HeadObjectCommand(params);
        const response = await s3.send(command);
        console.log("Object attributes:");
        console.log(` - Size: ${response.ContentLength} bytes`);
        console.log(` - Last Modified: ${response.LastModified}`);
        console.log(` - ETag: ${response.ETag}`);
        console.log(` - Content Type: ${response.ContentType}`);
        // 添加更多元数据
    } catch (err) {
        console.error("Error getting object attributes:", err);
    }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log("Usage: node GetObjectAttr.js <bucketName> <keyName>");
    process.exit(1);
}

const [bucketName, keyName] = args;
getObjectAttributes(bucketName, keyName);

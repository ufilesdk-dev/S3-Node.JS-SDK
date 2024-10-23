const s3 = require('../s3client');
const { GetObjectAclCommand } = require("@aws-sdk/client-s3");

async function getObjectAcl(bucketName, keyName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        const command = new GetObjectAclCommand(params);
        const response = await s3.send(command);
        console.log("Object ACL:", response);
    } catch (err) {
        console.error("Error getting object ACL:", err);
    }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log("Usage: node GetObjectAcl.js <bucketName> <keyName>");
    process.exit(1);
}

const [bucketName, keyName] = args;
getObjectAcl(bucketName, keyName);

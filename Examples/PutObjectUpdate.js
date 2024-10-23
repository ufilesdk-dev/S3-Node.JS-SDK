const s3 = require('../s3client');
const { CopyObjectCommand } = require("@aws-sdk/client-s3");

async function updateStorageClass(bucketName, keyName, storageClass) {
    try {
        const copySource = `${bucketName}/${keyName}`;
        const params = {
            Bucket: bucketName,
            CopySource: copySource,  
            Key: keyName,
            StorageClass: storageClass,
            MetadataDirective: 'COPY'
        };
        const command = new CopyObjectCommand(params);
        const response = await s3.send(command);
        console.log("Storage class updated successfully", response);
        return response;
    } catch (err) {
        console.error("Error updating storage class", err);
        throw err;
    }
}

const args = process.argv.slice(2);
if (args.length === 3) {
    const [bucketName, keyName, storageClass] = args;
    updateStorageClass(bucketName, keyName, storageClass)
        .then(() => console.log('Storage class update complete'))
        .catch((err) => console.error('Storage class update failed', err));
} else {
    console.log("Usage: node PutObjectUpdate.js <bucketName> <keyName> <storageClass>");
}

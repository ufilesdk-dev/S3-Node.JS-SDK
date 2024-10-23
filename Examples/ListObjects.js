const s3 = require('../s3client');
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");

async function listObjects(bucketName, maxKeys = 1000) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: maxKeys
        });

        let isTruncated = true;
        let contents = "";
        let continuationToken;

        console.log("Your bucket contains the following objects:\n");

        while (isTruncated) {
            const params = { ...command.input };
            if (continuationToken) {
                params.ContinuationToken = continuationToken;
            }

            const response = await s3.send(new ListObjectsV2Command(params));
            const contentsList = response.Contents.map((c) => ` • ${c.Key}`).join("\n");
            contents += contentsList + "\n";
            isTruncated = response.IsTruncated;
            continuationToken = response.NextContinuationToken;
        }

        console.log(contents);
    } catch (err) {
        console.error("Error listing objects:", err);
    }
}

const args = process.argv.slice(2);
if (args.length !== 1 && args.length !== 2) {
    console.log("Usage: node ListObjects.js <bucketName> [maxKeys]");
    process.exit(1);
}

const bucketName = args[0];
const maxKeys = args.length === 2 ? parseInt(args[1], 10) : 1000;

listObjects(bucketName, maxKeys);

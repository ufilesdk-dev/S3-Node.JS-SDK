const {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand
} = require("@aws-sdk/client-s3");
const s3 = require('../s3client');
const fs = require('fs');
const crypto = require('crypto');

// 计算 MD5
const calculateMD5 = (data) => {
    return crypto.createHash('md5').update(data).digest('base64');
};

const sliceUpload = async (bucketName, key, filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const partSize = 8 * 1024 * 1024; // 固定8MB
    const numParts = Math.ceil(fileBuffer.length / partSize);

    let uploadId;

    try {
        // 创建分片上传任务
        const createMultipartUploadResponse = await s3.send(
            new CreateMultipartUploadCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        uploadId = createMultipartUploadResponse.UploadId;
        const uploadedParts = [];

        for (let partNumber = 1; partNumber <= numParts; partNumber++) {
            const start = (partNumber - 1) * partSize;
            const end = Math.min(start + partSize, fileBuffer.length);
            const partBuffer = fileBuffer.subarray(start, end);
            const md5Hash = calculateMD5(partBuffer);
            const uploadPartCommand = new UploadPartCommand({
                Bucket: bucketName,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNumber,
                Body: partBuffer,
                ContentMD5: md5Hash,
            });

            const uploadPartResponse = await s3.send(uploadPartCommand);
            console.log(`Part ${partNumber} uploaded successfully`);
            uploadedParts.push({
                ETag: uploadPartResponse.ETag,
                PartNumber: partNumber,
            });
        }

        // 验证分片
        uploadedParts.forEach((part) => {
            if (!part.ETag) {
                throw new Error(`Part ${part.PartNumber} failed to upload.`);
            }
        });

        // 完成分片上传
        await s3.send(
            new CompleteMultipartUploadCommand({
                Bucket: bucketName,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: uploadedParts,
                },
            })
        );

        console.log(`Successfully uploaded ${key} to ${bucketName}`);
    } catch (error) {
        console.error("Error uploading file:", error);

        if (uploadId) {
            // 中止上传
            await s3.send(
                new AbortMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: key,
                    UploadId: uploadId,
                })
            );
        }
    }
};

const args = process.argv.slice(2);
if (args.length === 3) {
    const [bucketName, key, filePath] = args;
    sliceUpload(bucketName, key, filePath)
        .then(() => console.log("Upload complete"))
        .catch((err) => console.error("Upload failed", err));
} else {
    console.log("Usage: node SliceUpload.js <bucketName> <keyName> <filePath>");
}

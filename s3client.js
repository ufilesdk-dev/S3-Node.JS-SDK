const { S3Client } = require("@aws-sdk/client-s3");

const credentials = {
    accessKeyId: "",
    secretAccessKey: ""
};

const s3 = new S3Client({
    endpoint: "",  // http://s3-cn-sh2.ufileos.com
    region: "",   // cn-sh2
    signatureVersion: 'v4',
    credentials: credentials,  
});


module.exports = s3;

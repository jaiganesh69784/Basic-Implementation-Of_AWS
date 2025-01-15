const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const fileName = event.pathParameters.fileName;
    const imageUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: `processed/${fileName}`,
      Expires: 3600
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: imageUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
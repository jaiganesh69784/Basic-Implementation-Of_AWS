const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body);
    const imageData = Buffer.from(body.image, 'base64');
    const fileName = `original/${Date.now()}-${body.fileName}`;

    // Upload to S3
    await s3.putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: imageData,
      ContentType: 'image/jpeg'
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Upload successful',
        fileName: fileName
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Upload failed',
        message: error.message
      })
    };
  }
};
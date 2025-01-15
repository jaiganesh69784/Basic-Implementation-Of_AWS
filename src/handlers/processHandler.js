const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key);

    const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    const processedImage = await sharp(image.Body)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const processedKey = key.replace('original/', 'processed/');

    await s3.putObject({
      Bucket: bucket,
      Key: processedKey,
      Body: processedImage,
      ContentType: 'image/jpeg'
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Processing successful' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
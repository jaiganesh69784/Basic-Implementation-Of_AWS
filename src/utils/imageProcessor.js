const sharp = require('sharp');

class ImageProcessor {
  static async resize(buffer, width, height) {
    try {
      return await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  static async getMetadata(buffer) {
    try {
      return await sharp(buffer).metadata();
    } catch (error) {
      throw new Error(`Failed to get image metadata: ${error.message}`);
    }
  }
}

module.exports = ImageProcessor;
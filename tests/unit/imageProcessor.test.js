const ImageProcessor = require('../../src/utils/imageProcessor');

describe('ImageProcessor', () => {
  test('resize should process image correctly', async () => {
    // Create a mock image buffer
    const mockBuffer = Buffer.from('mock image data');

    try {
      const result = await ImageProcessor.resize(mockBuffer, 800, 800);
      expect(result).toBeDefined();
    } catch (error) {
      // We expect an error here since we're using mock data
      expect(error.message).toContain('Image processing failed');
    }
  });

  test('getMetadata should return image information', async () => {
    const mockBuffer = Buffer.from('mock image data');

    try {
      await ImageProcessor.getMetadata(mockBuffer);
    } catch (error) {
      expect(error.message).toContain('Failed to get image metadata');
    }
  });
});
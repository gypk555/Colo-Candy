import sharp from 'sharp';

/**
 * Compress image while maintaining quality
 * Automatically detects image type and applies optimal compression
 * @param {Buffer} imageBuffer - The image buffer to compress
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1200)
 * @param {number} options.maxHeight - Maximum height (default: 1200)
 * @param {number} options.quality - Compression quality 1-100 (default: 85)
 * @returns {Promise<Buffer>} Compressed image buffer
 */
async function compressImage(imageBuffer, mimeType, options = {}) {
  try {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 85
    } = options;

    let processor = sharp(imageBuffer);

    // Resize if image is larger than max dimensions
    const metadata = await processor.metadata();
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      processor = processor.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply format-specific compression
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/jpg':
        processor = processor.jpeg({ quality, progressive: true });
        break;

      case 'image/png':
        processor = processor.png({
          quality,
          compressionLevel: 9 // Max compression level
        });
        break;

      case 'image/webp':
        processor = processor.webp({ quality });
        break;

      case 'image/gif':
        // GIF compression is limited, just resize
        break;

      default:
        // Default to JPEG for unknown types
        processor = processor.jpeg({ quality, progressive: true });
    }

    const compressedBuffer = await processor.toBuffer();

    // Log compression stats
    const originalSize = (imageBuffer.length / 1024).toFixed(2);
    const compressedSize = (compressedBuffer.length / 1024).toFixed(2);
    const compressionRatio = ((1 - compressedBuffer.length / imageBuffer.length) * 100).toFixed(2);

    console.log(`📦 Image Compression Stats:`);
    console.log(`   Original: ${originalSize} KB`);
    console.log(`   Compressed: ${compressedSize} KB`);
    console.log(`   Reduction: ${compressionRatio}%`);

    return compressedBuffer;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error(`Image compression failed: ${error.message}`);
  }
}

/**
 * Compress profile image (optimized for profile pictures)
 * Profile images are typically smaller, so we use tighter compression
 * @param {Buffer} imageBuffer - The image buffer
 * @param {string} mimeType - The MIME type
 * @returns {Promise<Buffer>} Compressed profile image
 */
async function compressProfileImage(imageBuffer, mimeType) {
  return compressImage(imageBuffer, mimeType, {
    maxWidth: 500,      // Profile pictures don't need to be huge
    maxHeight: 500,
    quality: 85         // Good quality with smaller file size
  });
}

/**
 * Compress product image (optimized for product catalogs)
 * Product images should be high quality for good display
 * @param {Buffer} imageBuffer - The image buffer
 * @param {string} mimeType - The MIME type
 * @returns {Promise<Buffer>} Compressed product image
 */
async function compressProductImage(imageBuffer, mimeType) {
  return compressImage(imageBuffer, mimeType, {
    maxWidth: 1200,     // Product images can be larger for detail
    maxHeight: 1200,
    quality: 80         // Slightly lower quality than profile for more compression
  });
}

export {
  compressImage,
  compressProfileImage,
  compressProductImage
};

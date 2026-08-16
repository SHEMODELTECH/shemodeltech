// src/utils/blobStorage.js - Vercel Blob Storage Utilities (Server-Side API) 
/**
 * Convert file to base64 for API transmission
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 encoded file data
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Get base64 string without the data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Generate unique filename with timestamp and random string
 * @param {string} originalName - Original file name
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const sanitizedBase = baseName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
  
  return `${sanitizedBase}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Upload image to Vercel Blob via server-side API
 * @param {File} file - Image file to upload
 * @param {string} folder - Optional folder path (e.g., 'posts', 'profiles')
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
export const uploadImageToBlob = async (file, folder = 'posts') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name);
    const filepath = `${folder}/${uniqueFilename}`;

    // Call server-side API endpoint
    const response = await fetch('/api/blob-storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filepath,
        contentType: file.type,
        fileData: base64Data,
        originalName: file.name,
        size: file.size
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();

    // Return standardized result matching previous format
    return {
      url: result.url,
      width: null, // Blob doesn't provide dimensions
      height: null,
      size: file.size,
      type: file.type,
      name: file.name,
      deletehash: result.pathname, // Use pathname for deletion
      pathname: result.pathname,
      contentType: result.contentType,
      uploadedAt: result.uploadedAt || new Date().toISOString()
    };

  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

/**
 * Delete image from Vercel Blob via server-side API
 * @param {string} urlOrPathname - Full URL or pathname of the blob to delete
 * @returns {Promise<void>}
 */
export const deleteImageFromBlob = async (urlOrPathname) => {
  try {
    if (!urlOrPathname) {
      throw new Error('No URL or pathname provided');
    }

    // Extract pathname if full URL is provided
    let pathname = urlOrPathname;
    if (urlOrPathname.startsWith('http')) {
      const url = new URL(urlOrPathname);
      pathname = url.pathname.substring(1); // Remove leading slash
    }

    // Call server-side API endpoint for deletion
    const response = await fetch('/api/blob-storage', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pathname
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete image:', errorText);
    } else {
      console.log('Image deleted successfully from Vercel Blob');
    }
    
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    // Don't throw error - deletion failures shouldn't break the app
  }
};

/**
 * Upload multiple images to Vercel Blob
 * @param {File[]} files - Array of image files
 * @param {string} folder - Optional folder path
 * @param {Function} onProgress - Optional progress callback (index, progress, total)
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleImagesToBlob = async (files, folder = 'posts', onProgress = null) => {
  if (!files || files.length === 0) {
    return [];
  }

  const results = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    try {
      if (onProgress) onProgress(i, 0, total);
      
      const result = await uploadImageToBlob(files[i], folder);
      results.push(result);
      
      if (onProgress) onProgress(i, 100, total);
    } catch (error) {
      console.error(`Error uploading file ${i} (${files[i].name}):`, error);
      results.push({ 
        error: error.message, 
        filename: files[i].name,
        failed: true 
      });
      
      if (onProgress) onProgress(i, -1, total);
    }
  }
  
  return results;
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateImageFile = (file) => {
  if (!file) {
    return 'No file provided';
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Only JPEG, PNG, GIF, and WebP are supported';
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }

  return null;
};

/**
 * Create preview URL for image file
 * @param {File} file - Image file
 * @returns {string} - Object URL for preview
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Cleanup preview URLs
 * @param {string[]} urls - Array of object URLs to revoke
 */
export const cleanupImagePreviews = (urls) => {
  if (!urls || !Array.isArray(urls)) return;
  
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error revoking object URL:', error);
      }
    }
  });
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get optimized image URL (for future CDN integration)
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  // For now, return original URL
  // Can be extended to add query parameters for image optimization
  const { width, height, quality } = options;
  
  // Future: Add Vercel Image Optimization parameters
  // Example: ?w=800&q=75
  
  return url;
};

/**
 * Validate multiple image files
 * @param {File[]} files - Array of files to validate
 * @returns {Object} - Validation result with valid files and errors
 */
export const validateMultipleImages = (files) => {
  const validFiles = [];
  const errors = [];
  
  if (!files || files.length === 0) {
    return { validFiles, errors };
  }
  
  files.forEach((file, index) => {
    const error = validateImageFile(file);
    if (error) {
      errors.push({ index, filename: file.name, error });
    } else {
      validFiles.push(file);
    }
  });
  
  return { validFiles, errors };
};

/**
 * Check if image URL is valid and accessible
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} - True if valid and accessible
 */
export const isValidImageUrl = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType && contentType.startsWith('image/');
  } catch (error) {
    console.error('Error checking image URL:', error);
    return false;
  }
};

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Object with width and height
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Compress image before upload (client-side)
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width (default: 1920)
 * @param {number} quality - Compression quality 0-1 (default: 0.8)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = url;
  });
};

// Export all functions
export default {
  uploadImageToBlob,
  deleteImageFromBlob,
  uploadMultipleImagesToBlob,
  validateImageFile,
  validateMultipleImages,
  createImagePreview,
  cleanupImagePreviews,
  formatFileSize,
  getOptimizedImageUrl,
  isValidImageUrl,
  getImageDimensions,
  compressImage
};

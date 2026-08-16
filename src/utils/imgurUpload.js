// src/utils/imgurUpload.js

/**
 * Upload an image file to Imgur
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
export const uploadToImgur = async (file) => {
  const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('Imgur Client ID not configured. Please add REACT_APP_IMGUR_CLIENT_ID to your .env file');
  }

  // Validate file
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 10MB');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${clientId}`,
      },
      body: formData
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.data?.error || 'Upload failed');
    }

    return {
      url: result.data.link,
      deleteHash: result.data.deletehash, // Save this for potential deletion
      id: result.data.id,
      filename: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Imgur upload error:', error);
    if (error.message.includes('Client-ID')) {
      throw new Error('Imgur configuration error. Please contact support.');
    }
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Validate an image file before upload
 * @param {File} file - The file to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return 'No file selected';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a JPEG, PNG, GIF, or WebP image';
  }

  if (file.size > maxSize) {
    return 'Image must be smaller than 10MB';
  }

  if (file.size === 0) {
    return 'File appears to be empty';
  }

  return null; // No error
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create a preview URL for a file
 * @param {File} file - The file to create preview for
 * @returns {string} - Object URL for preview
 */
export const createFilePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Clean up file preview URLs
 * @param {string[]} urls - Array of object URLs to revoke
 */
export const cleanupPreviews = (urls) => {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};

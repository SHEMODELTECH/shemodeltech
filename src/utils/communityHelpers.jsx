// src/utils/communityHelpers.js - She Model Tech Utility Functions (Updated for Vercel Blob with Server-Side API)

import {
  deleteImageFromBlob,
  validateImageFile as blobValidateImageFile,
  createImagePreview as blobCreateImagePreview,
  cleanupImagePreviews as blobCleanupImagePreviews,
  formatFileSize as blobFormatFileSize,
} from './blobStorage';

export const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date';
  let date;
  if (dateValue && typeof dateValue.toDate === 'function') {
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = new Date(dateValue);
  } else {
    return 'Unknown date';
  }
  if (isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString();
};

export const formatTime = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (dateValue && typeof dateValue.toDate === 'function') {
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = new Date(dateValue);
  } else {
    return '';
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const formatFileSize = (bytes) => blobFormatFileSize(bytes);
export const createImagePreview = (file) => blobCreateImagePreview(file);
export const cleanupImagePreviews = (previewUrls) => blobCleanupImagePreviews(previewUrls);
export const validateImageFile = (file) => blobValidateImageFile(file);

export const sanitizeFilename = (filename) => {
  if (!filename) return 'file';
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const sanitizedBase = sanitizeFilename(baseName);
  return `${sanitizedBase}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Compress image to under 1MB before upload to avoid Vercel 4.5MB body limit
 * Returns { base64, contentType }
 */
const compressImageForUpload = (file, maxSizeMB = 1, maxDimension = 1920) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const tryCompress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64 = dataUrl.split(',')[1];
          const sizeBytes = (base64.length * 3) / 4;
          if (sizeBytes > maxSizeMB * 1024 * 1024 && quality > 0.2) {
            quality -= 0.1;
            tryCompress();
          } else {
            resolve({ base64, contentType: 'image/jpeg' });
          }
        };
        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image to Vercel Blob via server-side API
 * Images are compressed before upload to stay under Vercel's 4.5MB body limit
 */
export const uploadImageToStorage = async (file, folder = 'posts') => {
  try {
    const validationError = validateImageFile(file);
    if (validationError) throw new Error(validationError);

    // Compress before upload - converts to JPEG under 1MB
    const { base64: base64Data, contentType: compressedType } = await compressImageForUpload(file);

    const uniqueFilename = generateUniqueFilename(file.name).replace(/\.[^.]+$/, '.jpg');
    const filepath = `${folder}/${uniqueFilename}`;

    const response = await fetch('/api/blob-storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: filepath,
        contentType: compressedType,
        fileData: base64Data,
        originalName: file.name,
        size: file.size,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // `message` carries the real cause (missing token, blob rejected the
      // request, file too large). `error` is only a generic label, so
      // surfacing that alone made every failure look identical.
      const detail = errorData.message || errorData.error;
      throw new Error(detail || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return {
      url: result.url,
      pathname: result.pathname || filepath,
      type: compressedType,
      size: file.size,
      name: file.name,
      contentType: result.contentType || compressedType,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteImageFromStorage = async (urlOrPathname) => {
  try {
    const response = await fetch('/api/blob-storage', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlOrPathname }),
    });
    if (!response.ok) console.error('Failed to delete image:', await response.text());
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const uploadMultipleImages = async (files, onProgress = null, folder = 'posts') => {
  if (!files || files.length === 0) return [];
  const results = [];
  const total = files.length;
  for (let i = 0; i < files.length; i++) {
    try {
      if (onProgress) onProgress(i, 0, total);
      const result = await uploadImageToStorage(files[i], folder);
      results.push(result);
      if (onProgress) onProgress(i, 100, total);
    } catch (error) {
      console.error(`Error uploading file ${i} (${files[i].name}):`, error);
      results.push({ error: error.message, filename: files[i].name, failed: true });
      if (onProgress) onProgress(i, -1, total);
    }
  }
  return results;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isUserOnline = (lastActive) => {
  if (!lastActive) return false;
  const lastActiveDate = lastActive instanceof Date ? lastActive : new Date(lastActive);
  if (isNaN(lastActiveDate.getTime())) return false;
  return Math.floor((new Date() - lastActiveDate) / (1000 * 60)) < 5;
};

export const getOptimizedImageUrl = (url, options = {}) => url;

export const formatRelativeTime = (dateValue) => {
  if (!dateValue) return 'Unknown time';
  let date;
  if (dateValue && typeof dateValue.toDate === 'function') {
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = new Date(dateValue);
  } else {
    return 'Unknown time';
  }
  if (isNaN(date.getTime())) return 'Unknown time';
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const m = Math.floor(diffInSeconds / 60);
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const h = Math.floor(diffInSeconds / 3600);
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const d = Math.floor(diffInSeconds / 86400);
    return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  }
  if (diffInSeconds < 2592000) {
    const w = Math.floor(diffInSeconds / 604800);
    return `${w} ${w === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffInSeconds < 31536000) {
    const mo = Math.floor(diffInSeconds / 2592000);
    return `${mo} ${mo === 1 ? 'month' : 'months'} ago`;
  }
  const y = Math.floor(diffInSeconds / 31536000);
  return `${y} ${y === 1 ? 'year' : 'years'} ago`;
};

export const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#(\w+)/g);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
};

export const extractUrls = (text) => {
  if (!text) return [];
  return text.match(/(https?:\/\/[^\s]+)/g) || [];
};

export const isValidImageUrl = async (url) => {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType && contentType.startsWith('image/');
  } catch {
    return false;
  }
};

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
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob)
            resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
          else reject(new Error('Compression failed'));
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

export const batchUploadImages = async (files, onProgress, folder = 'posts') =>
  uploadMultipleImages(files, onProgress, folder);

export const validateMultipleImages = (files) => {
  const validFiles = [],
    errors = [];
  if (!files || files.length === 0) return { validFiles, errors };
  files.forEach((file, index) => {
    const error = validateImageFile(file);
    if (error) errors.push({ index, filename: file.name, error });
    else validFiles.push(file);
  });
  return { validFiles, errors };
};

export const formatBytesDetailed = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + sizes[i];
};

export default {
  formatDate,
  formatTime,
  formatRelativeTime,
  copyToClipboard,
  formatFileSize,
  formatBytesDetailed,
  createImagePreview,
  cleanupImagePreviews,
  validateImageFile,
  uploadImageToStorage,
  deleteImageFromStorage,
  uploadMultipleImages,
  truncateText,
  isUserOnline,
  getOptimizedImageUrl,
  extractHashtags,
  extractUrls,
  sanitizeFilename,
  generateUniqueFilename,
  isValidImageUrl,
  getImageDimensions,
  compressImage,
  batchUploadImages,
  validateMultipleImages,
};

// src/utils/errorHandler.js
import { toast } from 'react-toastify';
import { useState } from 'react';

/**
 * User-friendly error messages for common Firebase error codes
 */
const USER_FRIENDLY_MESSAGES = {
  'permission-denied': 'You don\'t have permission to perform this action.',
  'network-request-failed': 'Please check your internet connection and try again.',
  'internal-error': 'Something went wrong. Please try again later.',
  'unavailable': 'Service is temporarily unavailable. Please try again.',
  'deadline-exceeded': 'Request timed out. Please try again.',
  'not-found': 'The requested resource was not found.',
  'already-exists': 'This item already exists.',
  'cancelled': 'Operation was cancelled.',
  'data-loss': 'Data may have been lost. Please try again.',
  'failed-precondition': 'Operation failed due to system state.',
  'invalid-argument': 'Invalid data provided. Please check your input.',
  'out-of-range': 'Value is out of acceptable range.',
  'resource-exhausted': 'System is temporarily overloaded. Please try again.',
  'unauthenticated': 'Please log in to continue.',
  'aborted': 'Operation was aborted. Please try again.',
  'quota-exceeded': 'Service limit reached. Please try again later.',
  'rate-limited': 'Too many requests. Please slow down and try again.',
  'index-not-ready': 'Database is being optimized. Please try again in a few minutes.',
  'default': 'An unexpected error occurred. Please try again.'
};

/**
 * Handle Firebase errors with user-friendly messages
 * @param {Error} error - The Firebase error object
 * @param {string} context - Optional context for debugging
 * @returns {string} - User-friendly error message
 */
export const handleFirebaseError = (error, context = '') => {
  // Log for debugging only in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Firebase Error [${context}]:`, {
      error,
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
  }

  let userMessage = USER_FRIENDLY_MESSAGES.default;
  
  // Handle Firebase error codes
  if (error?.code) {
    userMessage = USER_FRIENDLY_MESSAGES[error.code] || USER_FRIENDLY_MESSAGES.default;
    
    // Special handling for index errors
    if (error.code === 'failed-precondition' && error.message?.includes('index')) {
      userMessage = USER_FRIENDLY_MESSAGES['index-not-ready'];
    }
  } 
  // Handle generic error messages
  else if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('firestore') || message.includes('internal assertion')) {
      userMessage = USER_FRIENDLY_MESSAGES['internal-error'];
    } else if (message.includes('network') || message.includes('offline')) {
      userMessage = USER_FRIENDLY_MESSAGES['network-request-failed'];
    } else if (message.includes('permission') || message.includes('unauthorized')) {
      userMessage = USER_FRIENDLY_MESSAGES['permission-denied'];
    } else if (message.includes('quota') || message.includes('limit')) {
      userMessage = USER_FRIENDLY_MESSAGES['quota-exceeded'];
    } else if (message.includes('index')) {
      userMessage = USER_FRIENDLY_MESSAGES['index-not-ready'];
    }
  }

  // Show user-friendly toast message
  toast.error(userMessage);
  return userMessage;
};

/**
 * Wrapper for safe Firestore operations with automatic error handling
 * @param {Function} operation - The async operation to execute
 * @param {string} context - Optional context for debugging
 * @returns {Promise} - Result of the operation or throws user-friendly error
 */
export const safeFirestoreOperation = async (operation, context = '') => {
  try {
    return await operation();
  } catch (error) {
    handleFirebaseError(error, context);
    throw new Error('Operation failed');
  }
};

/**
 * React hook for handling errors in components
 * @returns {Object} - Object with executeWithErrorHandling function and loading state
 */
export const useErrorHandler = () => {
  const [isLoading, setIsLoading] = useState(false);

  const executeWithErrorHandling = async (operation, context = '') => {
    setIsLoading(true);
    
    try {
      const result = await operation();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      handleFirebaseError(error, context);
      return null;
    }
  };

  return { executeWithErrorHandling, isLoading };
};

/**
 * Helper function to retry failed operations
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @param {string} context - Context for error reporting
 * @returns {Promise} - Result of the operation
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000, context = '') => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error types
      if (error.code === 'permission-denied' || 
          error.code === 'unauthenticated' || 
          error.code === 'not-found' ||
          error.code === 'invalid-argument') {
        handleFirebaseError(error, `${context} (non-retryable)`);
        throw error;
      }
      
      if (attempt === maxRetries) {
        handleFirebaseError(error, `${context} (final attempt)`);
        throw error;
      }
      
      // Log retry attempt in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Retry attempt ${attempt} for ${context}:`, error);
      }
      
      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
};

/**
 * Show success toast message
 * @param {string} message - Success message to display
 * @param {Object} options - Toast options (autoClose, etc.)
 */
export const showSuccessMessage = (message, options = {}) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

/**
 * Show info toast message
 * @param {string} message - Info message to display
 * @param {Object} options - Toast options
 */
export const showInfoMessage = (message, options = {}) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

/**
 * Show warning toast message
 * @param {string} message - Warning message to display
 * @param {Object} options - Toast options
 */
export const showWarningMessage = (message, options = {}) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

/**
 * Show error toast message
 * @param {string} message - Error message to display
 * @param {Object} options - Toast options
 */
export const showErrorMessage = (message, options = {}) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

/**
 * Log error to console with additional context (development only)
 * @param {Error} error - The error to log
 * @param {string} context - Additional context
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context = '', additionalData = {}) => {
  if (process.env.NODE_ENV === 'development') {
    const errorInfo = {
      message: error.message,
      code: error.code,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...additionalData
    };
    
    console.error('Error details:', errorInfo);
  }
  
  // In production, you might want to send this to an error reporting service
  // like Sentry, LogRocket, or similar
};

/**
 * Handle promise rejections gracefully
 * @param {Promise} promise - The promise to handle
 * @param {string} context - Context for error logging
 * @returns {Promise} - Promise that always resolves (never rejects)
 */
export const handlePromise = async (promise, context = '') => {
  try {
    const result = await promise;
    return { success: true, data: result, error: null };
  } catch (error) {
    logError(error, context);
    return { success: false, data: null, error };
  }
};

/**
 * Validate user input with custom error messages
 * @param {Object} validations - Object with field validations
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateInput = (validations) => {
  const errors = [];
  
  Object.entries(validations).forEach(([field, rules]) => {
    const { value, required, minLength, maxLength, pattern, custom } = rules;
    
    if (required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      return;
    }
    
    if (value && minLength && value.toString().length < minLength) {
      errors.push(`${field} must be at least ${minLength} characters`);
    }
    
    if (value && maxLength && value.toString().length > maxLength) {
      errors.push(`${field} must be no more than ${maxLength} characters`);
    }
    
    if (value && pattern && !pattern.test(value.toString())) {
      errors.push(`${field} format is invalid`);
    }
    
    if (value && custom && typeof custom === 'function') {
      const customError = custom(value);
      if (customError) {
        errors.push(customError);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

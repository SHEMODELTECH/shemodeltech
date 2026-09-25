// src/utils/throttle.js
/**
 * Throttle function - limits execution to once per specified interval.
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum ms between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle = false;
  let lastArgs = null;
  
  const throttled = function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
  
  throttled.cancel = () => {
    inThrottle = false;
    lastArgs = null;
  };
  
  return throttled;
}

export default throttle;

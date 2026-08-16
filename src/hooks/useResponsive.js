// src/hooks/useResponsive.js
// Custom hook for responsive design and device detection

import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive breakpoints (matching Tailwind defaults)
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * useResponsive Hook
 * 
 * Provides reactive breakpoint detection and device information
 * 
 * @returns {Object} Responsive state and utility functions
 * 
 * @example
 * const { isMobile, isTablet, isDesktop, width, height } = useResponsive();
 * 
 * if (isMobile) {
 *   return <MobileView />;
 * }
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoints, setBreakpoints] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isSmallMobile: false,
    isLargeDesktop: false,
  });

  const [orientation, setOrientation] = useState('portrait');

  const updateSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setWindowSize({ width, height });

    // Update breakpoints
    setBreakpoints({
      isSmallMobile: width < 375,
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isLargeDesktop: width >= BREAKPOINTS.xl,
    });

    // Update orientation
    setOrientation(width > height ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    // Initial update
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  /**
   * Check if current width is above a specific breakpoint
   * @param {string} breakpoint - 'sm', 'md', 'lg', 'xl', '2xl'
   * @returns {boolean}
   */
  const isAbove = useCallback((breakpoint) => {
    return windowSize.width >= BREAKPOINTS[breakpoint];
  }, [windowSize.width]);

  /**
   * Check if current width is below a specific breakpoint
   * @param {string} breakpoint - 'sm', 'md', 'lg', 'xl', '2xl'
   * @returns {boolean}
   */
  const isBelow = useCallback((breakpoint) => {
    return windowSize.width < BREAKPOINTS[breakpoint];
  }, [windowSize.width]);

  /**
   * Check if current width is between two breakpoints
   * @param {string} min - Minimum breakpoint
   * @param {string} max - Maximum breakpoint
   * @returns {boolean}
   */
  const isBetween = useCallback((min, max) => {
    return windowSize.width >= BREAKPOINTS[min] && windowSize.width < BREAKPOINTS[max];
  }, [windowSize.width]);

  return {
    // Window dimensions
    width: windowSize.width,
    height: windowSize.height,
    
    // Device categories
    ...breakpoints,
    
    // Orientation
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    
    // Utility functions
    isAbove,
    isBelow,
    isBetween,
    
    // Breakpoint values
    breakpoints: BREAKPOINTS,
  };
};

/**
 * useMediaQuery Hook
 * 
 * Listen to a custom media query
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query matches
 * 
 * @example
 * const isPrint = useMediaQuery('print');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event) => setMatches(event.matches);
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * useViewportHeight Hook
 * 
 * Get accurate viewport height accounting for mobile browser chrome
 * 
 * @returns {number} Viewport height in pixels
 */
export const useViewportHeight = () => {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight * 0.01);
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    
    return () => window.removeEventListener('resize', updateVh);
  }, []);

  return vh;
};

/**
 * useTouchDevice Hook
 * 
 * Detect if the device supports touch
 * 
 * @returns {boolean} Whether the device supports touch
 */
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
  }, []);

  return isTouch;
};

/**
 * useScrollLock Hook
 * 
 * Lock/unlock body scroll (useful for modals)
 * 
 * @param {boolean} locked - Whether scroll should be locked
 */
export const useScrollLock = (locked = false) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (locked) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [locked]);
};

/**
 * useDebounce Hook
 * 
 * Debounce a value (useful for window resize events)
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useResponsive;

/**
 * Geolocation Wrapper Utility
 * 
 * This utility provides safe wrappers around the browser's geolocation API
 * that respect the GEO_ENABLED configuration flag.
 * 
 * When GEO_ENABLED is false:
 * - getCurrentPosition returns rejected Promise with clear error
 * - watchPosition returns null immediately  
 * - clearWatch does nothing
 * - No permission prompts are triggered
 * 
 * When GEO_ENABLED is true:
 * - All functions behave exactly like navigator.geolocation
 * - Includes fallback handling for browsers without geolocation support
 */

import { GEO_ENABLED } from '../config/geolocation.js';

/**
 * Wraps navigator.geolocation.getCurrentPosition with feature flag support
 * 
 * @param {Object} options - Geolocation options (timeout, enableHighAccuracy, etc.)
 * @returns {Promise} Promise that resolves with position or rejects with error
 */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    // If geolocation is disabled, reject immediately with clear error
    if (!GEO_ENABLED) {
      reject(new Error('Geolocation disabled - Location requests have been disabled to prevent automatic permission prompts. To re-enable, set GEO_ENABLED = true in config/geolocation.js'));
      return;
    }

    // Check if geolocation is supported in this browser
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported - This browser does not support geolocation services'));
      return;
    }

    // Use native geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      options
    );
  });
}

/**
 * Wraps navigator.geolocation.watchPosition with feature flag support
 * 
 * @param {Function} success - Success callback function
 * @param {Function} error - Error callback function  
 * @param {Object} options - Geolocation options
 * @returns {number|null} Watch ID for clearing, or null if disabled
 */
export function watchPosition(success, error, options = {}) {
  // If geolocation is disabled, return null immediately
  if (!GEO_ENABLED) {
    // Optionally call error callback to inform caller
    if (typeof error === 'function') {
      setTimeout(() => {
        error(new Error('Geolocation disabled - Location watching has been disabled to prevent automatic permission prompts. To re-enable, set GEO_ENABLED = true in config/geolocation.js'));
      }, 0);
    }
    return null;
  }

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    if (typeof error === 'function') {
      setTimeout(() => {
        error(new Error('Geolocation not supported - This browser does not support geolocation services'));
      }, 0);
    }
    return null;
  }

  // Use native geolocation API
  return navigator.geolocation.watchPosition(success, error, options);
}

/**
 * Wraps navigator.geolocation.clearWatch with feature flag support
 * 
 * @param {number} watchId - The watch ID to clear
 */
export function clearWatch(watchId) {
  // If geolocation is disabled, do nothing
  if (!GEO_ENABLED) {
    return;
  }

  // Check if geolocation is supported and watchId is valid
  if (navigator.geolocation && typeof watchId === 'number') {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Utility function to check if geolocation is currently enabled
 * 
 * @returns {boolean} True if geolocation is enabled and supported
 */
export function isGeolocationEnabled() {
  return GEO_ENABLED && !!navigator.geolocation;
}

/**
 * Utility function to get current geolocation configuration status
 * 
 * @returns {Object} Status object with configuration and support info
 */
export function getGeolocationStatus() {
  return {
    configEnabled: GEO_ENABLED,
    browserSupported: !!navigator.geolocation,
    available: GEO_ENABLED && !!navigator.geolocation
  };
}

// Export all functions as default object for convenience
export default {
  getCurrentPosition,
  watchPosition,
  clearWatch,
  isGeolocationEnabled,
  getGeolocationStatus
};
/**
 * Geolocation Feature Configuration
 * 
 * This configuration controls whether the application should request
 * user location permission automatically.
 * 
 * Setting GEO_ENABLED = false disables all automatic geolocation requests
 * to prevent unwanted permission prompts.
 * 
 * To re-enable geolocation:
 * 1. Change GEO_ENABLED to true
 * 2. Rebuild/redeploy the application
 * 
 * Note: When disabled, all geolocation functions will return clear error
 * messages instead of prompting for permission.
 */

// Set to true to re-enable automatic geolocation requests
export const GEO_ENABLED = false;

// Export as default for convenience
export default {
  GEO_ENABLED
};
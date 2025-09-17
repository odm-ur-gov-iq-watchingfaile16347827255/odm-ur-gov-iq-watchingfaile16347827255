# Geolocation Feature Flag Implementation

## Overview

This implementation adds a feature-flagged geolocation wrapper to disable automatic location permission prompts by default. The change prevents the application from requesting user location unless explicitly enabled.

## Files Added

### 1. `config/geolocation.js`
Configuration file that controls geolocation behavior:
- `GEO_ENABLED = false` (default) - Disables all geolocation requests
- `GEO_ENABLED = true` - Enables normal geolocation functionality

### 2. `utils/geolocation.js`
Wrapper utility providing safe replacements for `navigator.geolocation` methods:
- `getCurrentPosition(options)` - Returns Promise, rejects when disabled
- `watchPosition(success, error, options)` - Returns null when disabled
- `clearWatch(watchId)` - No-op when disabled
- `isGeolocationEnabled()` - Check if geolocation is available
- `getGeolocationStatus()` - Get detailed status information

## Integration Steps

Since this repository contains a built/bundled Vue.js application, integration requires rebuilding from source:

### 1. Replace Direct Geolocation Usage

Found in `js/chunk-3ebcb9e1.1f697748.js`:
```javascript
// Replace this:
navigator.geolocation.getCurrentPosition(callback)

// With this:
import { getCurrentPosition } from './utils/geolocation.js';
getCurrentPosition().then(callback).catch(errorHandler);
```

### 2. Update Imports in Source Code

In your Vue.js source files:
```javascript
// Add import
import { getCurrentPosition, watchPosition, clearWatch } from '@/utils/geolocation';

// Replace navigator.geolocation calls
// OLD:
navigator.geolocation.getCurrentPosition(success, error, options);

// NEW:
getCurrentPosition(options).then(success).catch(error);
```

### 3. Handle Async Pattern

Convert callback-based code to Promise-based:
```javascript
// OLD pattern:
async getUserPosition() {
  navigator.geolocation.getCurrentPosition(position => {
    this.userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  });
}

// NEW pattern:
async getUserPosition() {
  try {
    const position = await getCurrentPosition();
    this.userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    console.warn('Geolocation unavailable:', error.message);
    // Handle gracefully - don't show location features
  }
}
```

## How to Re-enable Geolocation

To restore geolocation functionality:

1. Open `config/geolocation.js`
2. Change `export const GEO_ENABLED = false;` to `export const GEO_ENABLED = true;`
3. Rebuild and redeploy the application

## Benefits

- **No unwanted prompts**: Users won't see location permission requests by default
- **Clear error messages**: When disabled, functions provide helpful error descriptions
- **Easy re-enablement**: Single configuration flag controls all geolocation
- **Graceful degradation**: Application continues to work without location features
- **Browser compatibility**: Handles browsers without geolocation support

## Testing

Test the implementation by:

1. **Disabled state** (default):
   ```javascript
   import { getCurrentPosition } from './utils/geolocation.js';
   
   getCurrentPosition().catch(error => {
     console.log(error.message); // "Geolocation disabled - ..."
   });
   ```

2. **Enabled state**:
   ```javascript
   // Change GEO_ENABLED = true in config
   getCurrentPosition().then(position => {
     console.log('Location:', position.coords);
   });
   ```

## Current Usage Locations

The following locations need integration during the next build:

- `js/chunk-3ebcb9e1.1f697748.js` - Contains `navigator.geolocation.getCurrentPosition` calls
- Likely in Vue.js components that handle map functionality and user location

## Security Considerations

- No location data is collected when disabled
- Permission prompts are completely prevented
- Clear messaging explains why location is unavailable
- Easy to audit and modify geolocation behavior
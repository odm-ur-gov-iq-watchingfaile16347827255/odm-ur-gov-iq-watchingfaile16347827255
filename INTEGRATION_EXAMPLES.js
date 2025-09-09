/**
 * Integration Example: How to Replace Geolocation Usage
 * 
 * This file shows how to convert the existing geolocation code
 * found in the bundled JavaScript to use the new wrapper.
 */

// ===== BEFORE (Original Code Pattern Found) =====

// From js/chunk-3ebcb9e1.1f697748.js - simplified example:
function getUserPosition_OLD() {
  navigator.geolocation && navigator.geolocation.getCurrentPosition(position => {
    this.userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var icon = L.icon({
      iconUrl: "path/to/icon.png",
      // ... icon config
    });
    L.marker([this.userLocation.lat, this.userLocation.lng], {icon: icon})
      .addTo(this.$refs.mymap.mapObject)
      .bindPopup("موقعك الحالي<br>" + 
        parseFloat(this.userLocation.lng).toFixed(6) + ", " + 
        parseFloat(this.userLocation.lat).toFixed(6));
  });
}

// ===== AFTER (Using Wrapper) =====

// Import the wrapper functions
import { getCurrentPosition, isGeolocationEnabled } from './utils/geolocation.js';

// Updated function using Promise-based wrapper
async function getUserPosition_NEW() {
  // Check if geolocation is available before attempting
  if (!isGeolocationEnabled()) {
    console.warn('Geolocation disabled - location features not available');
    // Hide location-related UI elements or show appropriate message
    this.hideLocationFeatures();
    return;
  }

  try {
    const position = await getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: false
    });
    
    this.userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    const icon = L.icon({
      iconUrl: "path/to/icon.png", 
      // ... icon config
    });
    
    L.marker([this.userLocation.lat, this.userLocation.lng], {icon: icon})
      .addTo(this.$refs.mymap.mapObject)
      .bindPopup("موقعك الحالي<br>" + 
        parseFloat(this.userLocation.lng).toFixed(6) + ", " + 
        parseFloat(this.userLocation.lat).toFixed(6));
        
  } catch (error) {
    console.warn('Could not get user location:', error.message);
    // Handle gracefully - don't break the app
    this.handleLocationError(error);
  }
}

// Helper method to handle when geolocation is unavailable
function hideLocationFeatures() {
  // Hide "My Location" button
  const locationBtn = document.querySelector('.location-btn');
  if (locationBtn) {
    locationBtn.style.display = 'none';
  }
  
  // Show message to user (optional)
  this.showNotification('Location services are disabled', 'info');
}

function handleLocationError(error) {
  if (error.message.includes('Geolocation disabled')) {
    // This is expected when feature flag is off
    this.hideLocationFeatures();
  } else {
    // Real geolocation error (permission denied, timeout, etc.)
    this.showNotification('Unable to access location: ' + error.message, 'warning');
  }
}

// ===== Vue.js Component Integration Example =====

const mapComponent = {
  data() {
    return {
      userLocation: null,
      locationWatchId: null,
      isLocationAvailable: false
    };
  },
  
  async mounted() {
    // Check location availability on component mount
    this.isLocationAvailable = isGeolocationEnabled();
    
    if (this.isLocationAvailable) {
      // Only show location features if available
      this.initLocationFeatures();
    }
  },
  
  methods: {
    initLocationFeatures() {
      // Show location-related UI elements
      this.showLocationButton();
    },
    
    async myLocation() {
      try {
        const position = await getCurrentPosition();
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.flyToUserLocation();
      } catch (error) {
        this.handleLocationError(error);
      }
    },
    
    flyToUserLocation() {
      if (this.userLocation) {
        this.$refs.mymap.mapObject.flyTo(
          [this.userLocation.lat, this.userLocation.lng], 
          15, 
          {animate: true, duration: 3}
        );
      }
    }
  }
};

// ===== Specific Pattern Replacements =====

// Pattern 1: Direct navigator.geolocation check
// OLD: navigator.geolocation && navigator.geolocation.getCurrentPosition(...)
// NEW: 
import { getCurrentPosition, isGeolocationEnabled } from './utils/geolocation.js';
if (isGeolocationEnabled()) {
  getCurrentPosition().then(...).catch(...);
}

// Pattern 2: Callback-style geolocation
// OLD: navigator.geolocation.getCurrentPosition(successFn, errorFn, options)
// NEW: 
getCurrentPosition(options).then(successFn).catch(errorFn);

// Pattern 3: Watch position
// OLD: 
// const watchId = navigator.geolocation.watchPosition(success, error, options);
// NEW:
import { watchPosition, clearWatch } from './utils/geolocation.js';
const watchId = watchPosition(success, error, options);
// Note: watchId will be null if geolocation is disabled

// Pattern 4: Clear watch with null check
// OLD: navigator.geolocation.clearWatch(watchId);
// NEW: 
if (watchId !== null) {
  clearWatch(watchId);
}

// ===== Error Message Localization =====

// For Arabic/multilingual sites, you can customize error messages:
function getLocalizedGeolocationError(error) {
  if (error.message.includes('Geolocation disabled')) {
    return {
      ar: 'تم تعطيل خدمات الموقع - لإعادة التفعيل، يرجى تعديل إعدادات التطبيق',
      en: 'Location services disabled - To re-enable, please update app settings'
    };
  }
  
  return {
    ar: 'لا يمكن الوصول إلى الموقع: ' + error.message,
    en: 'Cannot access location: ' + error.message
  };
}

export { 
  getUserPosition_NEW, 
  hideLocationFeatures, 
  handleLocationError,
  getLocalizedGeolocationError
};
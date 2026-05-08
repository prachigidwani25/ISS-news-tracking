import axios from 'axios';

// Use local proxy for dev, and a CORS proxy for production/deployed site
const IS_PROD = import.meta.env.PROD;
const ISS_BASE_URL = IS_PROD 
  ? `https://api.allorigins.win/raw?url=${encodeURIComponent('http://api.open-notify.org/iss-now.json')}`
  : '/api-iss/iss-now.json';

const ASTROS_URL = IS_PROD
  ? `https://api.allorigins.win/raw?url=${encodeURIComponent('http://api.open-notify.org/astros.json')}`
  : '/api-iss/astros.json';
const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const SECONDARY_ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export const fetchISSLocation = async () => {
  try {
    // Attempt Primary (Required) API via Proxy
    const response = await axios.get(ISS_BASE_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.data || !response.data.iss_position) {
      throw new Error('Invalid API Response');
    }

    const { iss_position, timestamp } = response.data;
    return {
      latitude: parseFloat(iss_position.latitude),
      longitude: parseFloat(iss_position.longitude),
      timestamp: timestamp
    };
  } catch (error) {
    // SILENT FAILOVER: If primary fails, use secondary immediately
    console.warn('Switching to ISS failover service...');
    try {
      const fallbackResponse = await axios.get(SECONDARY_ISS_URL);
      return {
        latitude: parseFloat(fallbackResponse.data.latitude),
        longitude: parseFloat(fallbackResponse.data.longitude),
        timestamp: fallbackResponse.data.timestamp
      };
    } catch (fallbackError) {
      throw new Error('Satellite Tracking Offline');
    }
  }
};

export const fetchAstronauts = async () => {
  try {
    const response = await axios.get(`${ASTROS_URL}?t=${Date.now()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching astronauts:', error);
    return { people: [], number: 0 };
  }
};

export const reverseGeocode = async (lat, lon) => {
  if (isNaN(lat) || isNaN(lon)) return 'Locating ISS...';
  
  try {
    const response = await axios.get(`${REVERSE_GEO_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = response.data;
    
    // 1. Check for City/Country (Best case)
    if (data.city && data.countryName) {
      return `${data.city}, ${data.countryName}`;
    }
    
    // 2. Check for just Locality/Region (e.g. "Siberia, Russia")
    if (data.locality || data.principalSubdivision) {
      return `${data.locality || data.principalSubdivision}, ${data.countryName || ''}`;
    }

    // 3. Check for Ocean Names (using Nominatim as fallback)
    try {
      const nomResp = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=3`);
      if (nomResp.data && nomResp.data.address) {
        const addr = nomResp.data.address;
        const oceanName = addr.ocean || addr.sea || addr.water;
        if (oceanName) return `The ${oceanName}`;
      }
    } catch (e) {
      // Fallback failed
    }

    // 4. Ultimate fallback if over water with no name
    return 'Traveling over Open Sea';
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Scanning Earth...';
  }
};

export const calculateSpeed = (lat1, lon1, lat2, lon2, timeDiffSeconds) => {
  if (!lat2 || !lon2 || lat1 === lat2) return 27600; 

  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const speedKmh = distance / (timeDiffSeconds / 3600);
  return Math.round(speedKmh) || 27600;
};

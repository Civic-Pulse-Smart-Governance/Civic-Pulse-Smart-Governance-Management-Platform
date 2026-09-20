/**
 * geoProximityService.js
 * 
 * Geographic distance calculation, proximity prioritization relative to 
 * Admin location in Maharashtra, India, and AI-driven international location verification.
 */

// Baseline Admin HQ in Maharashtra
export const ADMIN_MAHARASHTRA_HQ = {
  name: 'Maharashtra State Command HQ',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  lat: 19.0760,
  lng: 72.8777,
};

// Comprehensive international geography database: Countries, US States, International Cities & Regions
const GLOBAL_FOREIGN_ENTITIES = {
  // All 50 US States & territories
  'new jersey': 'United States',
  'jersey': 'United States',
  'new york': 'United States',
  'california': 'United States',
  'texas': 'United States',
  'florida': 'United States',
  'washington': 'United States',
  'illinois': 'United States',
  'pennsylvania': 'United States',
  'ohio': 'United States',
  'georgia': 'United States',
  'north carolina': 'United States',
  'michigan': 'United States',
  'virginia': 'United States',
  'massachusetts': 'United States',
  'arizona': 'United States',
  'indiana': 'United States',
  'tennessee': 'United States',
  'missouri': 'United States',
  'maryland': 'United States',
  'wisconsin': 'United States',
  'colorado': 'United States',
  'minnesota': 'United States',
  'south carolina': 'United States',
  'alabama': 'United States',
  'louisiana': 'United States',
  'kentucky': 'United States',
  'oregon': 'United States',
  'oklahoma': 'United States',
  'connecticut': 'United States',
  'utah': 'United States',
  'iowa': 'United States',
  'nevada': 'United States',
  'arkansas': 'United States',
  'mississippi': 'United States',
  'kansas': 'United States',
  'new mexico': 'United States',
  'nebraska': 'United States',
  'idaho': 'United States',
  'west virginia': 'United States',
  'hawaii': 'United States',
  'new hampshire': 'United States',
  'maine': 'United States',
  'rhode island': 'United States',
  'montana': 'United States',
  'delaware': 'United States',
  'south dakota': 'United States',
  'north dakota': 'United States',
  'alaska': 'United States',
  'vermont': 'United States',
  'wyoming': 'United States',
  'puerto rico': 'United States',

  // Major US Cities
  'los angeles': 'United States',
  'chicago': 'United States',
  'houston': 'United States',
  'phoenix': 'United States',
  'philadelphia': 'United States',
  'san antonio': 'United States',
  'san diego': 'United States',
  'dallas': 'United States',
  'san jose': 'United States',
  'austin': 'United States',
  'seattle': 'United States',
  'san francisco': 'United States',
  'denver': 'United States',
  'boston': 'United States',
  'miami': 'United States',
  'atlanta': 'United States',
  'las vegas': 'United States',
  'detroit': 'United States',
  'orlando': 'United States',
  'manhattan': 'United States',
  'brooklyn': 'United States',
  'queens': 'United States',
  'bronx': 'United States',

  // Countries
  'usa': 'United States',
  'united states': 'United States',
  'america': 'United States',
  'uk': 'United Kingdom',
  'united kingdom': 'United Kingdom',
  'england': 'United Kingdom',
  'scotland': 'United Kingdom',
  'wales': 'United Kingdom',
  'london': 'United Kingdom',
  'manchester': 'United Kingdom',
  'birmingham': 'United Kingdom',
  'liverpool': 'United Kingdom',
  'leeds': 'United Kingdom',
  'glasgow': 'United Kingdom',
  'edinburgh': 'United Kingdom',
  'oxford': 'United Kingdom',
  'cambridge': 'United Kingdom',
  'canada': 'Canada',
  'ontario': 'Canada',
  'quebec': 'Canada',
  'toronto': 'Canada',
  'vancouver': 'Canada',
  'montreal': 'Canada',
  'calgary': 'Canada',
  'ottawa': 'Canada',
  'australia': 'Australia',
  'sydney': 'Australia',
  'melbourne': 'Australia',
  'brisbane': 'Australia',
  'perth': 'Australia',
  'adelaide': 'Australia',
  'uae': 'United Arab Emirates',
  'dubai': 'United Arab Emirates',
  'abu dhabi': 'United Arab Emirates',
  'sharjah': 'United Arab Emirates',
  'singapore': 'Singapore',
  'bahrain': 'Bahrain',
  'manama': 'Bahrain',
  'germany': 'Germany',
  'berlin': 'Germany',
  'munich': 'Germany',
  'frankfurt': 'Germany',
  'france': 'France',
  'paris': 'France',
  'marseille': 'France',
  'lyon': 'France',
  'italy': 'Italy',
  'rome': 'Italy',
  'milan': 'Italy',
  'spain': 'Spain',
  'madrid': 'Spain',
  'barcelona': 'Spain',
  'japan': 'Japan',
  'tokyo': 'Japan',
  'osaka': 'Japan',
  'kyoto': 'Japan',
  'china': 'China',
  'beijing': 'China',
  'shanghai': 'China',
  'hong kong': 'Hong Kong',
  'pakistan': 'Pakistan',
  'karachi': 'Pakistan',
  'lahore': 'Pakistan',
  'islamabad': 'Pakistan',
  'bangladesh': 'Bangladesh',
  'dhaka': 'Bangladesh',
  'chittagong': 'Bangladesh',
  'nepal': 'Nepal',
  'kathmandu': 'Nepal',
  'sri lanka': 'Sri Lanka',
  'colombo': 'Sri Lanka',
  'russia': 'Russia',
  'moscow': 'Russia',
  'saint petersburg': 'Russia',
  'brazil': 'Brazil',
  'sao paulo': 'Brazil',
  'rio de janeiro': 'Brazil',
  'mexico': 'Mexico',
  'mexico city': 'Mexico',
  'south africa': 'South Africa',
  'johannesburg': 'South Africa',
  'cape town': 'South Africa',
  'netherlands': 'Netherlands',
  'amsterdam': 'Netherlands',
  'switzerland': 'Switzerland',
  'zurich': 'Switzerland',
  'geneva': 'Switzerland',
  'saudi arabia': 'Saudi Arabia',
  'riyadh': 'Saudi Arabia',
  'jeddah': 'Saudi Arabia',
  'qatar': 'Qatar',
  'doha': 'Qatar',
  'kuwait': 'Kuwait',
  'oman': 'Oman',
  'muscat': 'Oman',
  'malaysia': 'Malaysia',
  'kuala lumpur': 'Malaysia',
  'thailand': 'Thailand',
  'bangkok': 'Thailand',
  'indonesia': 'Indonesia',
  'jakarta': 'Indonesia',
  'philippines': 'Philippines',
  'manila': 'Philippines',
  'vietnam': 'Vietnam',
  'hanoi': 'Vietnam',
  'ho chi minh': 'Vietnam',
  'south korea': 'South Korea',
  'seoul': 'South Korea',
  'new zealand': 'New Zealand',
  'auckland': 'New Zealand',
  'ireland': 'Ireland',
  'dublin': 'Ireland',
  'sweden': 'Sweden',
  'stockholm': 'Sweden',
  'norway': 'Norway',
  'oslo': 'Norway',
  'denmark': 'Denmark',
  'copenhagen': 'Denmark',
  'finland': 'Finland',
  'helsinki': 'Finland',
  'turkey': 'Turkey',
  'istanbul': 'Turkey',
  'ankara': 'Turkey',
  'egypt': 'Egypt',
  'cairo': 'Egypt',
  'kenya': 'Kenya',
  'nairobi': 'Kenya',
  'nigeria': 'Nigeria',
  'lagos': 'Nigeria',
  'israel': 'Israel',
  'tel aviv': 'Israel',
};

// Coordinates database for Indian cities & Maharashtra districts
const INDIAN_CITIES_COORDS = {
  // Maharashtra
  'mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra', isMH: true },
  'dadar': { lat: 19.0178, lng: 72.8478, state: 'Maharashtra', isMH: true },
  'bandra': { lat: 19.0596, lng: 72.8295, state: 'Maharashtra', isMH: true },
  'andheri': { lat: 19.1136, lng: 72.8697, state: 'Maharashtra', isMH: true },
  'borivali': { lat: 19.2307, lng: 72.8567, state: 'Maharashtra', isMH: true },
  'kurla': { lat: 19.0726, lng: 72.8845, state: 'Maharashtra', isMH: true },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, state: 'Maharashtra', isMH: true },
  'vashi': { lat: 19.0771, lng: 72.9986, state: 'Maharashtra', isMH: true },
  'thane': { lat: 19.2183, lng: 72.9781, state: 'Maharashtra', isMH: true },
  'naupada': { lat: 19.1860, lng: 72.9720, state: 'Maharashtra', isMH: true },
  'kalyan': { lat: 19.2437, lng: 73.1355, state: 'Maharashtra', isMH: true },
  'dombivli': { lat: 19.2184, lng: 73.0867, state: 'Maharashtra', isMH: true },
  'pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra', isMH: true },
  'kothrud': { lat: 18.5074, lng: 73.8077, state: 'Maharashtra', isMH: true },
  'hadapsar': { lat: 18.5089, lng: 73.9259, state: 'Maharashtra', isMH: true },
  'hinjewadi': { lat: 18.5913, lng: 73.7389, state: 'Maharashtra', isMH: true },
  'pcmc': { lat: 18.6279, lng: 73.8009, state: 'Maharashtra', isMH: true },
  'pimpri': { lat: 18.6279, lng: 73.8009, state: 'Maharashtra', isMH: true },
  'chinchwad': { lat: 18.6298, lng: 73.7997, state: 'Maharashtra', isMH: true },
  'nashik': { lat: 19.9975, lng: 73.7898, state: 'Maharashtra', isMH: true },
  'nashik road': { lat: 19.9542, lng: 73.8398, state: 'Maharashtra', isMH: true },
  'aurangabad': { lat: 19.8762, lng: 75.3433, state: 'Maharashtra', isMH: true },
  'chhatrapati sambhajinagar': { lat: 19.8762, lng: 75.3433, state: 'Maharashtra', isMH: true },
  'nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra', isMH: true },
  'solapur': { lat: 17.6599, lng: 75.9064, state: 'Maharashtra', isMH: true },
  'kolhapur': { lat: 16.7050, lng: 74.2433, state: 'Maharashtra', isMH: true },
  'amravati': { lat: 20.9374, lng: 77.7796, state: 'Maharashtra', isMH: true },
  'nanded': { lat: 19.1383, lng: 77.3210, state: 'Maharashtra', isMH: true },
  'sangli': { lat: 16.8524, lng: 74.5815, state: 'Maharashtra', isMH: true },
  'jalgaon': { lat: 21.0077, lng: 75.5626, state: 'Maharashtra', isMH: true },
  'akola': { lat: 20.7002, lng: 77.0082, state: 'Maharashtra', isMH: true },
  'latur': { lat: 18.4088, lng: 76.5604, state: 'Maharashtra', isMH: true },
  'dhule': { lat: 20.9042, lng: 74.7749, state: 'Maharashtra', isMH: true },
  'ahmednagar': { lat: 19.0948, lng: 74.7480, state: 'Maharashtra', isMH: true },
  'ahilyanagar': { lat: 19.0948, lng: 74.7480, state: 'Maharashtra', isMH: true },
  'satara': { lat: 17.6805, lng: 73.9997, state: 'Maharashtra', isMH: true },
  'ratnagiri': { lat: 16.9902, lng: 73.3120, state: 'Maharashtra', isMH: true },
  'sindhudurg': { lat: 16.1158, lng: 73.6933, state: 'Maharashtra', isMH: true },
  'raigad': { lat: 18.5158, lng: 73.1822, state: 'Maharashtra', isMH: true },
  'alibaug': { lat: 18.6414, lng: 72.8722, state: 'Maharashtra', isMH: true },
  'palghar': { lat: 19.6967, lng: 72.7699, state: 'Maharashtra', isMH: true },
  'vasai': { lat: 19.3919, lng: 72.8397, state: 'Maharashtra', isMH: true },
  'virar': { lat: 19.4700, lng: 72.8000, state: 'Maharashtra', isMH: true },
  'wardha': { lat: 20.7453, lng: 78.6022, state: 'Maharashtra', isMH: true },
  'chandrapur': { lat: 19.9615, lng: 79.2961, state: 'Maharashtra', isMH: true },
  'gondia': { lat: 21.4602, lng: 80.1961, state: 'Maharashtra', isMH: true },
  'bhandara': { lat: 21.1654, lng: 79.6543, state: 'Maharashtra', isMH: true },
  'beed': { lat: 18.9891, lng: 75.7601, state: 'Maharashtra', isMH: true },
  'parbhani': { lat: 19.2686, lng: 76.7708, state: 'Maharashtra', isMH: true },
  'osmanabad': { lat: 18.1856, lng: 76.0419, state: 'Maharashtra', isMH: true },
  'dharashiv': { lat: 18.1856, lng: 76.0419, state: 'Maharashtra', isMH: true },

  // Rest of India States & Major Cities
  'surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat', isMH: false },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat', isMH: false },
  'vadodara': { lat: 22.3072, lng: 73.1812, state: 'Gujarat', isMH: false },
  'rajkot': { lat: 22.3039, lng: 70.8022, state: 'Gujarat', isMH: false },
  'gujarat': { lat: 22.2587, lng: 71.1924, state: 'Gujarat', isMH: false },
  'goa': { lat: 15.2993, lng: 74.1240, state: 'Goa', isMH: false },
  'panaji': { lat: 15.4909, lng: 73.8278, state: 'Goa', isMH: false },
  'hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana', isMH: false },
  'telangana': { lat: 18.1124, lng: 79.0193, state: 'Telangana', isMH: false },
  'bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', isMH: false },
  'bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', isMH: false },
  'karnataka': { lat: 15.3173, lng: 75.7139, state: 'Karnataka', isMH: false },
  'mysore': { lat: 12.2958, lng: 76.6394, state: 'Karnataka', isMH: false },
  'chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', isMH: false },
  'tamil nadu': { lat: 11.1271, lng: 78.6569, state: 'Tamil Nadu', isMH: false },
  'coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu', isMH: false },
  'madurai': { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu', isMH: false },
  'delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi', isMH: false },
  'new delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi', isMH: false },
  'noida': { lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh', isMH: false },
  'gurugram': { lat: 28.4595, lng: 77.0266, state: 'Haryana', isMH: false },
  'gurgaon': { lat: 28.4595, lng: 77.0266, state: 'Haryana', isMH: false },
  'kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal', isMH: false },
  'west bengal': { lat: 22.9868, lng: 87.8550, state: 'West Bengal', isMH: false },
  'jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan', isMH: false },
  'rajasthan': { lat: 27.0238, lng: 74.2179, state: 'Rajasthan', isMH: false },
  'lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', isMH: false },
  'uttar pradesh': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', isMH: false },
  'indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', isMH: false },
  'bhopal': { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', isMH: false },
  'madhya pradesh': { lat: 22.9734, lng: 78.6569, state: 'Madhya Pradesh', isMH: false },
  'patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar', isMH: false },
  'bihar': { lat: 25.0961, lng: 85.3131, state: 'Bihar', isMH: false },
  'kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala', isMH: false },
  'kerala': { lat: 10.8505, lng: 76.2711, state: 'Kerala', isMH: false },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, state: 'Kerala', isMH: false },
  'chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Chandigarh', isMH: false },
  'punjab': { lat: 31.1471, lng: 75.3412, state: 'Punjab', isMH: false },
  'haryana': { lat: 29.0588, lng: 76.0856, state: 'Haryana', isMH: false },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, state: 'Odisha', isMH: false },
  'odisha': { lat: 20.9517, lng: 85.0985, state: 'Odisha', isMH: false },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', isMH: false },
  'andhra pradesh': { lat: 15.9129, lng: 79.7400, state: 'Andhra Pradesh', isMH: false },
  'guwahati': { lat: 26.1445, lng: 91.7362, state: 'Assam', isMH: false },
  'assam': { lat: 26.2006, lng: 92.9376, state: 'Assam', isMH: false },
  'jharkhand': { lat: 23.6102, lng: 85.2799, state: 'Jharkhand', isMH: false },
  'ranchi': { lat: 23.3441, lng: 85.3096, state: 'Jharkhand', isMH: false },
  'chhattisgarh': { lat: 21.2787, lng: 81.8661, state: 'Chhattisgarh', isMH: false },
  'raipur': { lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh', isMH: false },
  'uttarakhand': { lat: 30.0668, lng: 79.0193, state: 'Uttarakhand', isMH: false },
  'dehradun': { lat: 30.3165, lng: 78.0322, state: 'Uttarakhand', isMH: false },
  'himachal pradesh': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh', isMH: false },
  'shimla': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh', isMH: false },
  'jammu': { lat: 32.7266, lng: 74.8570, state: 'Jammu & Kashmir', isMH: false },
  'srinagar': { lat: 34.0837, lng: 74.7973, state: 'Jammu & Kashmir', isMH: false },
};

// In-memory cache for Puter AI location verifications
const locationAiCache = new Map();

/**
 * Haversine formula to compute great-circle distance between two points in km
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Check if string matches any known international location (outside India)
 */
export function checkIsOutsideIndia(locationStr = '') {
  if (!locationStr || typeof locationStr !== 'string') {
    return { isOutsideIndia: false };
  }

  const clean = locationStr.toLowerCase().trim();

  for (const [entity, country] of Object.entries(GLOBAL_FOREIGN_ENTITIES)) {
    const regex = new RegExp(`\\b${entity}\\b`, 'i');
    if (regex.test(clean)) {
      return {
        isOutsideIndia: true,
        detectedCountry: country,
        entityMatched: entity,
        reason: `Location is in ${country} (${entity}). Indian municipal administration holds no legal or operational jurisdiction in foreign territories.`,
      };
    }
  }

  return { isOutsideIndia: false };
}

/**
 * Synchronous global location analyzer
 */
export function analyzeLocationProximity(locationStr = '') {
  const rawLoc = (locationStr || '').trim();
  const lower = rawLoc.toLowerCase();

  if (!rawLoc) {
    return {
      rawLocation: '',
      isOutsideIndia: false,
      canBeSolved: true,
      distanceKm: 0,
      formattedDistance: '0 km',
      zone: 'local',
      zoneLabel: 'Local Metro Priority',
      badgeColor: 'emerald',
      statusNotice: 'Enter location',
    };
  }

  // 1. First check if cached from a previous Puter AI verification
  if (locationAiCache.has(lower)) {
    return locationAiCache.get(lower);
  }

  // 2. Global foreign detection (Matches New Jersey, California, London, Tokyo, etc.)
  const intlCheck = checkIsOutsideIndia(rawLoc);
  if (intlCheck.isOutsideIndia) {
    return {
      rawLocation: rawLoc,
      isOutsideIndia: true,
      canBeSolved: false,
      detectedCountry: intlCheck.detectedCountry,
      distanceKm: 12000,
      formattedDistance: `International (${intlCheck.detectedCountry})`,
      zone: 'international',
      zoneLabel: 'Non-India (Out of Jurisdiction)',
      priorityScore: 0,
      badgeColor: 'red',
      statusNotice: `⚠️ Cannot be solved by Admin — Location is in ${intlCheck.detectedCountry} (Outside Indian Municipal Jurisdiction)`,
      details: intlCheck.reason,
      verifiedByAi: false,
    };
  }

  // 3. Indian city / district coordinates resolution
  let matchKey = null;
  for (const key of Object.keys(INDIAN_CITIES_COORDS)) {
    if (lower.includes(key)) {
      matchKey = key;
      break;
    }
  }

  let distanceKm = 15;
  let isMaharashtra = true;
  let stateName = 'Maharashtra';

  if (matchKey) {
    const data = INDIAN_CITIES_COORDS[matchKey];
    distanceKm = calculateHaversineDistanceKm(
      ADMIN_MAHARASHTRA_HQ.lat,
      ADMIN_MAHARASHTRA_HQ.lng,
      data.lat,
      data.lng
    );
    isMaharashtra = data.isMH;
    stateName = data.state;
  } else {
    // If text contains 'maharashtra' or local Indian civic keywords
    if (lower.includes('maharashtra') || lower.includes('mumbai') || lower.includes('pune') || lower.includes('ward') || lower.includes('nagar') || lower.includes('sector') || lower.includes('road') || lower.includes('rasta') || lower.includes('chowk') || lower.includes('gali') || lower.includes('colony')) {
      distanceKm = 25;
      isMaharashtra = true;
      stateName = 'Maharashtra';
    } else {
      // Unknown place: Do NOT assume it is in India or 600km!
      // Must be verified by the authoritative geocoding API / Puter AI
      return {
        rawLocation: rawLoc,
        pendingVerification: true,
        exists: null,
        isInIndia: null,
        isOutsideIndia: false,
        canBeSolved: null,
        distanceKm: null,
        formattedDistance: 'Verifying...',
        zone: 'verifying',
        zoneLabel: 'Verifying location & jurisdiction...',
        statusNotice: 'Checking whether place exists on map and verifying jurisdiction...',
        badgeColor: 'slate',
        verifiedByAi: false,
      };
    }
  }

  // Classify zone & priority for known locations
  let zone = 'local';
  let zoneLabel = 'Local Metro Priority (< 50 km)';
  let badgeColor = 'emerald';
  let priorityScore = 100 - Math.min(distanceKm / 10, 90);

  if (distanceKm <= 50) {
    zone = 'local';
    zoneLabel = 'Local Metro Priority (< 50 km)';
    badgeColor = 'emerald';
  } else if (distanceKm <= 350 || isMaharashtra) {
    zone = 'maharashtra';
    zoneLabel = `Maharashtra Regional (${distanceKm} km)`;
    badgeColor = 'blue';
  } else {
    zone = 'interstate';
    zoneLabel = `Inter-State (${stateName}, ${distanceKm} km)`;
    badgeColor = 'amber';
  }

  return {
    rawLocation: rawLoc,
    exists: true,
    isInIndia: true,
    isOutsideIndia: false,
    canBeSolved: true,
    distanceKm,
    formattedDistance: `${distanceKm} km`,
    zone,
    zoneLabel,
    isMaharashtra,
    stateName,
    priorityScore: Math.round(priorityScore),
    badgeColor,
    statusNotice: isMaharashtra
      ? `Within Maharashtra Jurisdiction (${distanceKm} km from Admin HQ)`
      : `Inter-State Complaint (${stateName} - ${distanceKm} km from HQ)`,
    verifiedByAi: false,
  };
}

/**
 * Asynchronous Puter.js AI Location Verifier
 * Calls Puter AI (Gemini / GPT) to analyze the place, verify whether it is in India or abroad,
 * and calculate distance to Maharashtra Admin HQ.
 */
/**
 * Asynchronous Location & Jurisdiction Verifier API
 * 1. Checks whether the place exists on the world map.
 * 2. Checks whether it is located within India or not.
 * 3. If within India, calculates real distance to Maharashtra Admin HQ.
 * 4. Flags non-Indian locations as "Outside Jurisdiction - Cannot Be Solved by Admin".
 */
export async function verifyLocationWithPuterAI(locationStr = '') {
  if (!locationStr || typeof locationStr !== 'string') return null;
  const clean = locationStr.trim();
  if (clean.length < 2) return null;

  const lower = clean.toLowerCase();

  // Return cached result if available
  if (locationAiCache.has(lower)) {
    return locationAiCache.get(lower);
  }

  // 1. Primary: Query authoritative Geocoding & Jurisdiction API
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.exists === 'boolean') {
        const result = {
          rawLocation: clean,
          exists: data.exists,
          isInIndia: !!data.isInIndia,
          isOutsideIndia: !data.isInIndia && data.exists,
          canBeSolved: !!data.canBeSolved,
          isMaharashtra: !!data.isMaharashtra,
          country: data.country || 'Unknown',
          detectedCountry: data.detectedCountry || data.country || 'Unknown',
          stateName: data.stateName || data.state || '',
          cityName: data.city || clean,
          distanceKm: data.distanceKm || 0,
          formattedDistance: data.formattedDistance || `${data.distanceKm} km`,
          zone: data.zone || (data.isInIndia ? 'interstate' : 'international'),
          zoneLabel: data.zoneLabel || (data.isInIndia ? 'India' : 'Non-India (Out of Jurisdiction)'),
          statusNotice: data.statusNotice || '',
          reason: data.reason || (data.error || ''),
          error: data.error,
          badgeColor: !data.exists ? 'red' : (!data.isInIndia ? 'red' : (data.zone === 'local' ? 'emerald' : data.isMaharashtra ? 'blue' : 'amber')),
          verifiedByAi: true,
        };
        locationAiCache.set(lower, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Geocoding API network error, trying Puter.js direct client fallback:', err);
  }

  // 2. Secondary: If backend API is unreachable, try Puter.js in window
  if (typeof window !== 'undefined' && window.puter && window.puter.ai) {
    try {
      const prompt = `Analyze this place for Indian Municipal Governance: "${clean}".
1. Does this place actually exist on Earth? (true or false)
2. Is it located within the Republic of India? (true or false)
3. Which country does it belong to?
4. Estimated road/air distance in km from Mumbai, Maharashtra, India.
5. Can Indian municipal administration solve grievances here? (Strictly false if outside India or doesn't exist).

Respond ONLY with JSON:
{
  "exists": boolean,
  "isInIndia": boolean,
  "country": "string",
  "state": "string",
  "city": "string",
  "distanceKm": number,
  "canBeSolved": boolean
}`;

      const chatPromise = window.puter.ai.chat(prompt, { model: 'google/gemini-2.5-flash' });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Puter AI timeout')), 3000)
      );

      const response = await Promise.race([chatPromise, timeoutPromise]);
      let rawText = typeof response === 'string' ? response : (response?.message?.content || response?.text || JSON.stringify(response));
      const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);

      if (parsed && typeof parsed.exists === 'boolean') {
        const isOutsideIndia = parsed.exists && !parsed.isInIndia;
        const country = parsed.country || (isOutsideIndia ? 'Foreign Country' : 'India');
        const distanceKm = parsed.distanceKm || (isOutsideIndia ? 12000 : 150);

        const aiResult = {
          rawLocation: clean,
          exists: parsed.exists,
          isInIndia: !!parsed.isInIndia,
          isOutsideIndia,
          canBeSolved: !!parsed.canBeSolved && parsed.exists && parsed.isInIndia,
          detectedCountry: country,
          stateName: parsed.state || 'India',
          cityName: parsed.city || clean,
          distanceKm,
          formattedDistance: !parsed.exists ? 'Not Found' : (isOutsideIndia ? `International (${country})` : `${distanceKm} km`),
          zone: !parsed.exists ? 'invalid' : (isOutsideIndia ? 'international' : 'local'),
          zoneLabel: !parsed.exists ? 'Location Does Not Exist' : (isOutsideIndia ? 'Non-India (Out of Jurisdiction)' : 'India'),
          badgeColor: (!parsed.exists || isOutsideIndia) ? 'red' : 'emerald',
          statusNotice: !parsed.exists
            ? `⚠️ Location "${clean}" does not exist on the map.`
            : (isOutsideIndia
                ? `⚠️ Cannot be solved by Admin — Location is in ${country} (Outside Indian Municipal Jurisdiction)`
                : `Within Indian Jurisdiction (${distanceKm} km from Admin HQ)`),
          verifiedByAi: true,
        };

        locationAiCache.set(lower, aiResult);
        return aiResult;
      }
    } catch (err) {
      console.warn('Puter AI client fallback error:', err);
    }
  }

  // 3. Fallback using global geo knowledge
  const instant = analyzeLocationProximity(clean);
  if (instant.pendingVerification) {
    const unverifiedResult = {
      ...instant,
      exists: false,
      canBeSolved: false,
      statusNotice: `⚠️ Could not verify whether "${clean}" exists on the map. Please check spelling.`,
      verifiedByAi: false,
    };
    locationAiCache.set(lower, unverifiedResult);
    return unverifiedResult;
  }
  locationAiCache.set(lower, instant);
  return instant;
}

/**
 * Sort a list of complaints by proximity to Maharashtra Admin HQ (nearest first)
 */
export function sortComplaintsByProximity(complaints = [], nearestFirst = true) {
  return [...complaints].sort((a, b) => {
    const geoA = analyzeLocationProximity(a.location);
    const geoB = analyzeLocationProximity(b.location);

    // Non-India complaints go to the bottom because they cannot be solved
    if (geoA.isOutsideIndia && !geoB.isOutsideIndia) return 1;
    if (!geoA.isOutsideIndia && geoB.isOutsideIndia) return -1;

    return nearestFirst
      ? geoA.distanceKm - geoB.distanceKm
      : geoB.distanceKm - geoA.distanceKm;
  });
}

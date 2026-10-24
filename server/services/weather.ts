import { config } from '../config';

export interface CommodityFreshnessInfo {
  commodity: string;
  category: 'ULTRA_PERISHABLE' | 'MEDIUM_PERISHABLE' | 'DURABLE';
  baseShelfLifeHours: number;
  safeHoursRemaining: number;
  freshnessPercent: number;
  spoilageKineticsMultiplier: number;
  qualityGrade: 'FAQ Grade-A' | 'FAQ Grade-B' | 'Spoilage Imminent';
  safeUntilDate: string;
  statusMessage: string;
  recommendedAction: string;
  storageCondition: 'AMBIENT_AIR' | 'REEFER_COLD_CHAIN';
}

export interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  weatherCondition: string;
  weatherCode?: number;
  source: 'OPENWEATHER_API' | 'OPEN_METEO_AUTO_REALTIME' | 'CLIMATIC_MODEL';
  apiKeyConfigured: boolean;
  apiKeyActive: boolean;
  isDeviceLocation?: boolean;
  accuracyMeters?: number;
  timestamp: string;
  weatherNotification: string;
  notificationSeverity: 'INFO' | 'WARNING' | 'ALERT';
  freshness: CommodityFreshnessInfo;
}

// In-memory runtime override for API Key (if updated via UI or settings)
let runtimeOpenWeatherApiKey: string = config.openWeatherApiKey || '';

export function setRuntimeOpenWeatherApiKey(key: string): void {
  runtimeOpenWeatherApiKey = key.trim();
  config.openWeatherApiKey = runtimeOpenWeatherApiKey;
}

export function getRuntimeOpenWeatherApiKey(): string {
  return runtimeOpenWeatherApiKey;
}

// Major Agricultural Hubs & Mandi Geocoding Directory
const AGRI_LOCATIONS_DIRECTORY: Record<string, { lat: number; lon: number; name: string }> = {
  'nashik': { lat: 19.9975, lon: 73.7898, name: 'Nashik APMC Agri Belt, Maharashtra' },
  'pimpalgaon': { lat: 20.1691, lon: 73.9856, name: 'Pimpalgaon Baswant FPO Cluster, Nashik' },
  'delhi': { lat: 28.6139, lon: 77.2090, name: 'Azadpur APMC National Terminal, Delhi' },
  'azadpur': { lat: 28.7041, lon: 77.1725, name: 'Azadpur Mandi Gate 1, New Delhi' },
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Vashi APMC Agri Terminal, Navi Mumbai' },
  'vashi': { lat: 19.0771, lon: 72.9986, name: 'Vashi Wholesale Market, Navi Mumbai' },
  'pune': { lat: 18.5204, lon: 73.8567, name: 'Gultekdi APMC Market Yard, Pune' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Yeshwanthpur APMC Yard, Bengaluru' },
  'indore': { lat: 22.7196, lon: 75.8577, name: 'Choithram Mandi, Indore, Madhya Pradesh' },
  'jaipur': { lat: 26.9124, lon: 75.7873, name: 'Muhana Mandi, Jaipur, Rajasthan' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Jamalpur APMC, Ahmedabad, Gujarat' },
  'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Koley Market APMC, Kolkata, West Bengal' },
  'nagpur': { lat: 21.1458, lon: 79.0882, name: 'Kalamna Market Yard, Nagpur, Maharashtra' },
};

function resolveCoordinates(city?: string): { lat: number; lon: number; name: string } {
  if (!city) return AGRI_LOCATIONS_DIRECTORY['nashik'];
  const normalized = city.toLowerCase().trim();
  for (const [key, value] of Object.entries(AGRI_LOCATIONS_DIRECTORY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return { lat: 19.9975, lon: 73.7898, name: `${city} (Agri Region)` };
}

export async function reverseGeocodeCoordinates(lat: number, lon: number): Promise<{ locationName: string; city: string; state: string }> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || data.principalSubdivision;
      const city = data.city || locality || 'Current Location';
      const state = data.principalSubdivision || data.countryName || 'India';
      return {
        locationName: `${locality}, ${state} (Current Device Location)`,
        city,
        state,
      };
    }
  } catch (err) {
    console.warn('[Weather] Reverse geocoding failed, using coordinates:', err);
  }
  return {
    locationName: `GPS (${lat.toFixed(4)}°, ${lon.toFixed(4)}°) Current Device Location`,
    city: 'Device Location',
    state: 'India',
  };
}

// Produce decay profiles according to ICAR post-harvest standards
function getCommodityCategory(commodityName: string): {
  category: 'ULTRA_PERISHABLE' | 'MEDIUM_PERISHABLE' | 'DURABLE';
  baseSafeHours: number;
  optimalTempC: number;
} {
  const name = commodityName.toLowerCase();
  
  if (
    name.includes('tomato') ||
    name.includes('chilli') ||
    name.includes('strawberry') ||
    name.includes('grapes') ||
    name.includes('spinach') ||
    name.includes('coriander') ||
    name.includes('mushroom') ||
    name.includes('papaya')
  ) {
    return { category: 'ULTRA_PERISHABLE', baseSafeHours: 96, optimalTempC: 12 };
  }

  if (
    name.includes('cabbage') ||
    name.includes('cauliflower') ||
    name.includes('capsicum') ||
    name.includes('brinjal') ||
    name.includes('eggplant') ||
    name.includes('okra') ||
    name.includes('bhindi') ||
    name.includes('peas') ||
    name.includes('apple') ||
    name.includes('guava')
  ) {
    return { category: 'MEDIUM_PERISHABLE', baseSafeHours: 168, optimalTempC: 10 };
  }

  // Durable / Storable
  return { category: 'DURABLE', baseSafeHours: 1200, optimalTempC: 15 };
}

/**
 * Arrhenius Biochemical Spoilage Kinetics & Safe Shelf-Life Calculator
 */
export function calculateProduceFreshness(
  commodity: string = 'Tomato (Hybrid)',
  temperatureC: number,
  humidityPercent: number,
  harvestDateStr?: string,
  isReefer: boolean = false
): CommodityFreshnessInfo {
  const profile = getCommodityCategory(commodity);
  
  // Storage effective temperature
  const effectiveTemp = isReefer ? 4.5 : temperatureC;
  
  // Arrhenius decay factor: k = e^(0.0693 * (T - T_opt))
  const tempDelta = effectiveTemp - profile.optimalTempC;
  let k = Math.exp(0.0693 * tempDelta);

  // Humidity penalty (high humidity promotes fungal rot for ambient; dehydration if < 40%)
  if (!isReefer) {
    if (humidityPercent > 82) {
      k *= 1.25; // Botrytis / fungal acceleration
    } else if (humidityPercent < 45) {
      k *= 1.15; // Transpiration weight loss / shriveling
    }
  }

  k = Math.max(0.4, Math.round(k * 100) / 100);

  // Time elapsed since harvest
  let hoursElapsed = 12; // default reasonable estimate
  if (harvestDateStr) {
    try {
      const harvestTs = new Date(harvestDateStr).getTime();
      const nowTs = Date.now();
      if (!isNaN(harvestTs) && harvestTs < nowTs) {
        hoursElapsed = Math.max(1, Math.round((nowTs - harvestTs) / (1000 * 60 * 60)));
      }
    } catch {
      hoursElapsed = 12;
    }
  }

  // Safe hours remaining
  const effectiveTotalSafeHours = Math.round(profile.baseSafeHours / k);
  const safeHoursRemaining = Math.max(1, effectiveTotalSafeHours - hoursElapsed);
  
  // Freshness percentage (0 - 100%)
  const freshnessPercent = Math.max(
    8,
    Math.min(100, Math.round((safeHoursRemaining / effectiveTotalSafeHours) * 100))
  );

  let qualityGrade: 'FAQ Grade-A' | 'FAQ Grade-B' | 'Spoilage Imminent' = 'FAQ Grade-A';
  let recommendedAction = 'Prime quality. Eligible for highest e-NAM hammer price bid.';
  let statusMessage = `Optimal freshness at ${freshnessPercent}%. Shelf-life remaining: ${safeHoursRemaining} hrs.`;

  if (freshnessPercent < 45 || safeHoursRemaining < 18) {
    qualityGrade = 'Spoilage Imminent';
    statusMessage = `CRITICAL DECAY: High ambient heat (${temperatureC}°C) accelerating perishability. Safe only for ${safeHoursRemaining} hours!`;
    recommendedAction = 'Dispatch immediately via Pre-Cooled Reefer or trigger fast-track auction liquidation.';
  } else if (freshnessPercent < 75 || safeHoursRemaining < 48) {
    qualityGrade = 'FAQ Grade-B';
    statusMessage = `Moderate quality degradation detected. Safe for ${safeHoursRemaining} hours before Grade downgrading.`;
    recommendedAction = 'Prioritize aggregation into active FPO Reefer coalition within 8 hours.';
  }

  const safeUntil = new Date(Date.now() + safeHoursRemaining * 3600 * 1000).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return {
    commodity,
    category: profile.category,
    baseShelfLifeHours: profile.baseSafeHours,
    safeHoursRemaining,
    freshnessPercent,
    spoilageKineticsMultiplier: k,
    qualityGrade,
    safeUntilDate: safeUntil,
    statusMessage,
    recommendedAction,
    storageCondition: isReefer ? 'REEFER_COLD_CHAIN' : 'AMBIENT_AIR',
  };
}

/**
 * Main Weather & Freshness Detection Function
 * Supports OpenWeatherMap API Key, Open-Meteo auto-detection, and Agri Met fallback
 */
export async function fetchAmbientAgriWeather(params: {
  city?: string;
  lat?: number;
  lon?: number;
  accuracyMeters?: number;
  isDeviceLocation?: boolean;
  apiKey?: string;
  commodity?: string;
  harvestDate?: string;
  isReefer?: boolean;
} = {}): Promise<WeatherData> {
  const activeKey = params.apiKey || runtimeOpenWeatherApiKey || config.openWeatherApiKey;
  let isDevice = Boolean(params.isDeviceLocation || (params.lat && params.lon));
  let coordsName = params.city || 'Detected Geolocation';

  // If no coordinates or city given, auto-detect device location via IP immediately
  if (!params.lat && !params.lon && (!params.city || params.city === 'auto')) {
    try {
      const ipRes = await fetch('http://ip-api.com/json');
      if (ipRes.ok) {
        const ip = await ipRes.json();
        if (ip.lat && ip.lon) {
          params.lat = ip.lat;
          params.lon = ip.lon;
          isDevice = true;
          coordsName = `${ip.city || ip.regionName || 'Current Location'}, ${ip.regionName || 'India'} (Current Device Location)`;
        }
      }
    } catch (err) {
      console.warn('[Weather] Server IP location fallback failed:', err);
    }
  }

  if (params.lat && params.lon && (!params.city || params.city === 'Detected Geolocation')) {
    const geo = await reverseGeocodeCoordinates(params.lat, params.lon);
    coordsName = geo.locationName;
  }

  const coords = (params.lat && params.lon)
    ? { lat: params.lat, lon: params.lon, name: coordsName }
    : resolveCoordinates(params.city);

  let tempC = 23.5;
  let humidity = 65;
  let windSpeed = 10;
  let condition = 'Partly Cloudy';
  let weatherCode = 2;
  let source: WeatherData['source'] = 'CLIMATIC_MODEL';
  let apiKeyActive = false;

  // PRIORITY 1: OpenWeatherMap with API Key
  if (activeKey) {
    try {
      console.log(`[Weather] Calling OpenWeatherMap API for (${coords.lat}, ${coords.lon})...`);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${activeKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        tempC = Math.round(data.main.temp * 10) / 10;
        humidity = Math.round(data.main.humidity);
        windSpeed = Math.round((data.wind?.speed || 2.5) * 3.6); // m/s to km/h
        condition = data.weather?.[0]?.description ? capitalize(data.weather[0].description) : 'Clear Sky';
        source = 'OPENWEATHER_API';
        apiKeyActive = true;
      } else {
        console.warn(`[Weather] OpenWeatherMap returned ${res.status}: ${res.statusText}. Falling back to Open-Meteo...`);
      }
    } catch (err) {
      console.error('[Weather] OpenWeatherMap request error:', err);
    }
  }

  // PRIORITY 2: Open-Meteo Auto Real-Time Detection (100% Free, No key needed, Satellite & Station Data)
  if (source !== 'OPENWEATHER_API') {
    try {
      console.log(`[Weather] Auto-detecting real-time weather via Open-Meteo for (${coords.lat}, ${coords.lon})...`);
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const res = await fetch(openMeteoUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.current) {
          tempC = Math.round(data.current.temperature_2m * 10) / 10;
          humidity = Math.round(data.current.relative_humidity_2m);
          windSpeed = Math.round(data.current.wind_speed_10m);
          weatherCode = data.current.weather_code;
          condition = interpretWmoWeatherCode(weatherCode);
          source = 'OPEN_METEO_AUTO_REALTIME';
        }
      }
    } catch (err) {
      console.warn('[Weather] Open-Meteo auto-detection failed, using regional climatic model:', err);
    }
  }

  // PRIORITY 3: Climatic Seasonal Model Fallback
  if (source === 'CLIMATIC_MODEL') {
    const hour = new Date().getHours();
    const diurnalSwing = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 5;
    tempC = Math.round((22 + diurnalSwing) * 10) / 10;
    humidity = Math.round(62 - diurnalSwing * 2);
    condition = hour > 6 && hour < 18 ? 'Sunny Agricultural Sky' : 'Clear Night Sky';
  }

  // Calculate produce freshness & safe hours
  const freshness = calculateProduceFreshness(
    params.commodity || 'Tomato (Hybrid)',
    tempC,
    humidity,
    params.harvestDate,
    params.isReefer
  );

  // Generate dynamic weather notification
  let notificationSeverity: WeatherData['notificationSeverity'] = 'INFO';
  let weatherNotification = `Live Weather: ${tempC}°C, ${humidity}% humidity (${condition}) at ${coords.name}. Produce freshness safe.`;

  if (tempC >= 33) {
    notificationSeverity = 'ALERT';
    weatherNotification = `🔥 High Heat Alert (${tempC}°C): Extreme ambient heat is accelerating spoilage kinetics by ${freshness.spoilageKineticsMultiplier}x! Freshness safe for ${freshness.safeHoursRemaining} hours. Dispatch in Cold-Chain Reefer immediately.`;
  } else if (humidity > 80) {
    notificationSeverity = 'WARNING';
    weatherNotification = `🌧️ High Moisture & Spoilage Advisory (${humidity}% RH): Elevated humidity increases fungal rot risk. Safe window: ${freshness.safeHoursRemaining} hours. Ensure ventilated or refrigerated transit.`;
  } else if (freshness.safeHoursRemaining <= 24) {
    notificationSeverity = 'WARNING';
    weatherNotification = `⏳ Perishability Warning: Freshness index at ${freshness.freshnessPercent}%. Product safe for ${freshness.safeHoursRemaining} hours remaining before grade drop.`;
  }

  return {
    location: coords.name,
    coordinates: { lat: coords.lat, lon: coords.lon },
    temperatureC: tempC,
    humidityPercent: humidity,
    windSpeedKmh: windSpeed,
    weatherCondition: condition,
    weatherCode,
    source,
    apiKeyConfigured: Boolean(activeKey),
    apiKeyActive,
    isDeviceLocation: isDevice,
    accuracyMeters: params.accuracyMeters,
    timestamp: new Date().toISOString(),
    weatherNotification,
    notificationSeverity,
    freshness,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function interpretWmoWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy / Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Hail / Cold Wind';
  if (code >= 80 && code <= 82) return 'Heavy Rain';
  if (code >= 95) return 'Thunderstorm';
  return 'Fair Agri Weather';
}


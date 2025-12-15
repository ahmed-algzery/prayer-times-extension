import { Coordinates } from '../types';

interface CityEntry {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Static lookup table for common cities
const CITY_LOOKUP: CityEntry[] = [
  // Egypt
  { city: 'Cairo', country: 'EG', latitude: 30.0444, longitude: 31.2357 },
  { city: 'Alexandria', country: 'EG', latitude: 31.2001, longitude: 29.9187 },
  { city: 'Giza', country: 'EG', latitude: 30.0131, longitude: 31.2089 },
  
  // Saudi Arabia
  { city: 'Mecca', country: 'SA', latitude: 21.3891, longitude: 39.8579 },
  { city: 'Medina', country: 'SA', latitude: 24.5247, longitude: 39.5692 },
  { city: 'Riyadh', country: 'SA', latitude: 24.7136, longitude: 46.6753 },
  { city: 'Jeddah', country: 'SA', latitude: 21.4858, longitude: 39.1925 },
  
  // Turkey
  { city: 'Istanbul', country: 'TR', latitude: 41.0082, longitude: 28.9784 },
  { city: 'Ankara', country: 'TR', latitude: 39.9334, longitude: 32.8597 },
  
  // Indonesia
  { city: 'Jakarta', country: 'ID', latitude: -6.2088, longitude: 106.8456 },
  { city: 'Bandung', country: 'ID', latitude: -6.9175, longitude: 107.6191 },
  
  // Pakistan
  { city: 'Karachi', country: 'PK', latitude: 24.8607, longitude: 67.0011 },
  { city: 'Lahore', country: 'PK', latitude: 31.5204, longitude: 74.3587 },
  { city: 'Islamabad', country: 'PK', latitude: 33.6844, longitude: 73.0479 },
  
  // Malaysia
  { city: 'Kuala Lumpur', country: 'MY', latitude: 3.1390, longitude: 101.6869 },
  
  // UAE
  { city: 'Dubai', country: 'AE', latitude: 25.2048, longitude: 55.2708 },
  { city: 'Abu Dhabi', country: 'AE', latitude: 24.4539, longitude: 54.3773 },
  
  // UK
  { city: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278 },
  
  // USA
  { city: 'New York', country: 'US', latitude: 40.7128, longitude: -74.0060 },
  { city: 'Los Angeles', country: 'US', latitude: 34.0522, longitude: -118.2437 },
  { city: 'Chicago', country: 'US', latitude: 41.8781, longitude: -87.6298 },
  
  // Canada
  { city: 'Toronto', country: 'CA', latitude: 43.6532, longitude: -79.3832 },
  
  // Australia
  { city: 'Sydney', country: 'AU', latitude: -33.8688, longitude: 151.2093 },
  { city: 'Melbourne', country: 'AU', latitude: -37.8136, longitude: 144.9631 },
  
  // France
  { city: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522 },
  
  // Germany
  { city: 'Berlin', country: 'DE', latitude: 52.5200, longitude: 13.4050 },
  
  // India
  { city: 'Mumbai', country: 'IN', latitude: 19.0760, longitude: 72.8777 },
  { city: 'Delhi', country: 'IN', latitude: 28.6139, longitude: 77.2090 },
  
  // Bangladesh
  { city: 'Dhaka', country: 'BD', latitude: 23.8103, longitude: 90.4125 },
  
  // Morocco
  { city: 'Casablanca', country: 'MA', latitude: 33.5731, longitude: -7.5898 },
  { city: 'Rabat', country: 'MA', latitude: 34.0209, longitude: -6.8416 },
  
  // Tunisia
  { city: 'Tunis', country: 'TN', latitude: 36.8065, longitude: 10.1815 },
  
  // Algeria
  { city: 'Algiers', country: 'DZ', latitude: 36.7538, longitude: 3.0588 },
  
  // Jordan
  { city: 'Amman', country: 'JO', latitude: 31.9539, longitude: 35.9106 },
  
  // Lebanon
  { city: 'Beirut', country: 'LB', latitude: 33.8938, longitude: 35.5018 },
  
  // Syria
  { city: 'Damascus', country: 'SY', latitude: 33.5138, longitude: 36.2765 },
  
  // Iraq
  { city: 'Baghdad', country: 'IQ', latitude: 33.3152, longitude: 44.3661 },
  
  // Iran
  { city: 'Tehran', country: 'IR', latitude: 35.6892, longitude: 51.3890 },
  
  // Qatar
  { city: 'Doha', country: 'QA', latitude: 25.2854, longitude: 51.5310 },
  
  // Kuwait
  { city: 'Kuwait City', country: 'KW', latitude: 29.3759, longitude: 47.9774 },
  
  // Bahrain
  { city: 'Manama', country: 'BH', latitude: 26.0667, longitude: 50.5577 },
  
  // Oman
  { city: 'Muscat', country: 'OM', latitude: 23.5880, longitude: 58.3829 },
  
  // Yemen
  { city: 'Sanaa', country: 'YE', latitude: 15.3694, longitude: 44.1910 },
];

/**
 * Get coordinates for a city and country combination
 * @param city City name
 * @param country Country code (ISO 3166-1 alpha-2)
 * @returns Coordinates object with latitude and longitude, or Cairo as fallback
 */
export function getCoordinates(city: string, country: string): Coordinates {
  const normalizedCity = city.trim();
  const normalizedCountry = country.trim().toUpperCase();
  
  const entry = CITY_LOOKUP.find(
    (e) => e.city.toLowerCase() === normalizedCity.toLowerCase() && 
           e.country.toUpperCase() === normalizedCountry
  );
  
  if (entry) {
    return {
      latitude: entry.latitude,
      longitude: entry.longitude
    };
  }
  
  // Fallback to Cairo coordinates
  return {
    latitude: 30.0444,
    longitude: 31.2357
  };
}


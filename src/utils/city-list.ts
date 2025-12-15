/**
 * Lists of cities and countries for VS Code configuration dropdowns
 */

export const COUNTRIES = [
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'SY', name: 'Syria' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IR', name: 'Iran' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'YE', name: 'Yemen' }
];

export const CITIES = [
  // Egypt
  'Cairo', 'Alexandria', 'Giza',
  // Saudi Arabia
  'Mecca', 'Medina', 'Riyadh', 'Jeddah',
  // Turkey
  'Istanbul', 'Ankara',
  // Indonesia
  'Jakarta', 'Bandung',
  // Pakistan
  'Karachi', 'Lahore', 'Islamabad',
  // Malaysia
  'Kuala Lumpur',
  // UAE
  'Dubai', 'Abu Dhabi',
  // UK
  'London',
  // USA
  'New York', 'Los Angeles', 'Chicago',
  // Canada
  'Toronto',
  // Australia
  'Sydney', 'Melbourne',
  // France
  'Paris',
  // Germany
  'Berlin',
  // India
  'Mumbai', 'Delhi',
  // Bangladesh
  'Dhaka',
  // Morocco
  'Casablanca', 'Rabat',
  // Tunisia
  'Tunis',
  // Algeria
  'Algiers',
  // Jordan
  'Amman',
  // Lebanon
  'Beirut',
  // Syria
  'Damascus',
  // Iraq
  'Baghdad',
  // Iran
  'Tehran',
  // Qatar
  'Doha',
  // Kuwait
  'Kuwait City',
  // Bahrain
  'Manama',
  // Oman
  'Muscat',
  // Yemen
  'Sanaa'
];

export const COUNTRY_CODES = COUNTRIES.map(c => c.code);


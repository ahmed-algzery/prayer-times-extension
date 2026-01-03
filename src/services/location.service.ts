import * as vscode from "vscode";
import {
  getCountries,
  getCountryByCode,
  getStatesOfCountry,
  getAllCitiesOfCountry,
  getCitiesOfState,
  searchCitiesByName,
} from "@countrystatecity/countries";
import { Coordinates } from "../types";

/**
 * Location service for managing country, state, and city data
 */
export class LocationService {
  /**
   * Get all countries
   * @returns Promise of array of all countries with ISO codes and names
   */
  static async getAllCountries() {
    return await getCountries();
  }

  /**
   * Get a country by its ISO code
   * @param countryCode ISO 3166-1 alpha-2 country code
   * @returns Promise of country object or undefined
   */
  static async getCountryByCode(countryCode: string) {
    return await getCountryByCode(countryCode);
  }

  /**
   * Get all states/regions for a country
   * @param countryCode ISO 3166-1 alpha-2 country code
   * @returns Promise of array of states/regions
   */
  static async getStatesOfCountry(countryCode: string) {
    return await getStatesOfCountry(countryCode);
  }

  /**
   * Get all cities for a country
   * @param countryCode ISO 3166-1 alpha-2 country code
   * @returns Promise of array of cities
   */
  static async getCitiesOfCountry(countryCode: string) {
    return await getAllCitiesOfCountry(countryCode);
  }

  /**
   * Get all cities for a specific state
   * @param countryCode ISO 3166-1 alpha-2 country code
   * @param stateCode State ISO code
   * @returns Promise of array of cities
   */
  static async getCitiesOfState(countryCode: string, stateCode: string) {
    return await getCitiesOfState(countryCode, stateCode);
  }

  /**
   * Get coordinates for a city
   * @param cityName City name
   * @param countryCode ISO 3166-1 alpha-2 country code
   * @returns Promise of coordinates object with latitude and longitude, or Cairo as fallback
   */
  static async getCoordinates(
    cityName: string,
    countryCode: string
  ): Promise<Coordinates> {
    const normalizedCityName = cityName.trim();
    const normalizedCountryCode = countryCode.trim().toUpperCase();

    try {
      // Get all cities for the country
      const cities = await this.getCitiesOfCountry(normalizedCountryCode);

      // Find the city by name (case-insensitive)
      // First try exact match, then try startsWith for cities with sub-regions
      let city = cities.find(
        (c: any) => c.name.toLowerCase() === normalizedCityName.toLowerCase()
      );

      // If no exact match, try to find a city that starts with the search term
      if (!city) {
        city = cities.find((c: any) =>
          c.name.toLowerCase().startsWith(normalizedCityName.toLowerCase())
        );
      }

      if (city && city.latitude && city.longitude) {
        console.log(city);
        return {
          latitude: parseFloat(city.latitude),
          longitude: parseFloat(city.longitude),
        };
      }
    } catch (error) {
      console.error(`Error fetching city data: ${error}`);
    }

    // Fallback to Cairo coordinates
    vscode.window.showWarningMessage(
      `City "${cityName}" not found in country "${countryCode}". Using Cairo as fallback.`
    );

    return {
      latitude: 30.0444,
      longitude: 31.2357,
    };
  }

  /**
   * Search for cities by name across all countries
   * @param searchTerm Search term for city name
   * @param countryCode Optional country code to limit search
   * @param stateCode Optional state code to limit search
   * @param limit Maximum number of results to return
   * @returns Promise of array of cities matching the search
   */
  static async searchCities(
    searchTerm: string,
    countryCode: string = "",
    stateCode: string = "",
    limit: number = 10
  ) {
    const results = await searchCitiesByName(
      countryCode,
      stateCode,
      searchTerm
    );
    return results.slice(0, limit);
  }
}

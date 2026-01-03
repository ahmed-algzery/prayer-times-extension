import {
  PrayerTimes,
  Coordinates as AdhanCoordinates,
  CalculationMethod,
  CalculationParameters,
} from "adhan";
import { PrayerInfo } from "../types";

export class PrayerService {
  private coordinates: AdhanCoordinates;
  private calculationMethod: () => CalculationParameters;
  private calculationParams: CalculationParameters;

  constructor(latitude: number, longitude: number, method: string) {
    this.coordinates = new AdhanCoordinates(latitude, longitude);
    this.calculationMethod = this.mapMethodToCalculationMethod(method);
    this.calculationParams = this.calculationMethod();
  }

  /**
   * Map configuration string to adhan CalculationMethod
   */
  private mapMethodToCalculationMethod(
    method: string
  ): () => CalculationParameters {
    const methodMap: { [key: string]: () => CalculationParameters } = {
      Egyptian: CalculationMethod.Egyptian,
      UmmAlQura: CalculationMethod.UmmAlQura,
      MWL: CalculationMethod.MuslimWorldLeague,
      MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
      ISNA: CalculationMethod.NorthAmerica,
      NorthAmerica: CalculationMethod.NorthAmerica,
      Karachi: CalculationMethod.Karachi,
      Tehran: CalculationMethod.Tehran,
      Dubai: CalculationMethod.Dubai,
      Kuwait: CalculationMethod.Kuwait,
      Qatar: CalculationMethod.Qatar,
      Singapore: CalculationMethod.Singapore,
      Turkey: CalculationMethod.Turkey,
      MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
    };

    return methodMap[method] || CalculationMethod.Egyptian;
  }

  /**
   * Get prayer times for a specific date
   */
  public getPrayerTimes(date: Date): PrayerTimes {
    return new PrayerTimes(this.coordinates, date, this.calculationParams);
  }

  /**
   * Get all prayer times for today as an array
   */
  public getAllPrayerTimes(date: Date = new Date()): PrayerInfo[] {
    const prayerTimes = this.getPrayerTimes(date);

    return [
      {
        name: "fajr",
        time: prayerTimes.fajr,
        displayName: "Fajr",
      },
      {
        name: "dhuhr",
        time: prayerTimes.dhuhr,
        displayName: "Dhuhr",
      },
      {
        name: "asr",
        time: prayerTimes.asr,
        displayName: "Asr",
      },
      {
        name: "maghrib",
        time: prayerTimes.maghrib,
        displayName: "Maghrib",
      },
      {
        name: "isha",
        time: prayerTimes.isha,
        displayName: "Isha",
      },
    ];
  }

  /**
   * Get the next upcoming prayer
   */
  public getNextPrayer(date: Date = new Date()): PrayerInfo {
    const now = date;
    const todayPrayers = this.getAllPrayerTimes(now);

    // Find the first prayer that hasn't occurred yet today
    for (const prayer of todayPrayers) {
      if (prayer.time > now) {
        return prayer;
      }
    }

    // If no prayers left today, return tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = this.getAllPrayerTimes(tomorrow);
    return tomorrowPrayers[0]; // Fajr is the first prayer
  }

  /**
   * Calculate remaining time until a specific date
   */
  public getRemainingTime(
    targetDate: Date,
    currentDate: Date = new Date()
  ): {
    totalSeconds: number;
    minutes: number;
    seconds: number;
    formatted: string;
  } {
    const diffMs = targetDate.getTime() - currentDate.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = Math.abs(totalSeconds % 60);

    // Format as hours and minutes (e.g., "2h 24m") or just minutes (e.g., "23 min")
    let formatted: string;
    if (totalSeconds < 0) {
      formatted = `${Math.abs(totalMinutes)} min ago`;
    } else if (hours > 0) {
      formatted = `${hours}h ${minutes}m`;
    } else {
      formatted = `${minutes} min`;
    }

    return {
      totalSeconds,
      minutes: totalMinutes,
      seconds,
      formatted,
    };
  }
}

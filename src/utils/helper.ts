/**
 * Format date based on user's locale
 * @param date date to format
 * @returns formatted date
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time based on user's time format preference
 * @param date date to format
 * @param currentTimeFormat time format preference
 * @returns formatted time
 */
export function formatTime(
  date: Date,
  currentTimeFormat: "12h" | "24h"
): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: currentTimeFormat === "12h",
  });
}

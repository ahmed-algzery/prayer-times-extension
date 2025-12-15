# Change Log

All notable changes to the "Islamic Prayer Times" extension will be documented in this file.

## [1.1.0] - 2025-12-15

### Added
- Enhanced notifications with emoji and better formatting
- Prayer time arrival notifications
- City and country dropdown lists in settings (43 cities, 28 countries)
- Extension icon (mosque design with crescent and star)
- File existence check for Adhan audio before playback
- Improved error handling for audio playback

### Improved
- Notification messages now show: "🕌 Prayer Reminder: {Prayer} in X minutes"
- Prayer time notification: "🕌 {Prayer} time has arrived!"
- Better Adhan audio error handling and user feedback
- Fixed Windows path escaping for audio playback
- Improved Linux audio playback (paplay/aplay with error suppression)
- Status bar shows "🕌 {Prayer} now" when prayer time arrives

### Changed
- City and country settings now use dropdown lists instead of free text input
- Each city/country option includes descriptive text (e.g., "Cairo, Egypt")

## [1.0.0] - 2025-12-15

### Added
- Initial release of Islamic Prayer Times extension
- Display prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) in VS Code status bar
- Real-time countdown to next prayer (minutes only format)
- Reminder notifications before prayer time (configurable minutes)
- Adhan audio playback at prayer time (optional, cross-platform support)
- Support for multiple calculation methods:
  - Egyptian
  - Umm Al-Qura
  - Muslim World League (MWL)
  - North America (ISNA)
  - Karachi
  - Tehran
  - Dubai
  - Kuwait
  - Qatar
  - Singapore
  - Turkey
  - Moonsighting Committee
- Support for 50+ cities worldwide with static lookup table
- Command to view all prayer times for today
- Configurable settings for:
  - City and country
  - Calculation method
  - Reminder minutes (0-60)
  - Adhan enable/disable toggle
- Automatic status bar updates every minute
- Click status bar to view prayer details
- Automatic configuration change detection and service restart

### Technical Details
- Built with TypeScript
- Uses adhan library for prayer time calculations
- Cross-platform audio playback (Windows, macOS, Linux)
- Proper resource cleanup on deactivation
- Extension activates on `onStartupFinished` to avoid blocking VS Code startup


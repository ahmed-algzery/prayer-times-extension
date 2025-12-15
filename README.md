# Islamic Prayer Times

A VS Code extension that displays Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) in the status bar with reminders and optional Adhan audio notifications.

## Features

- ⏰ **Status Bar Display**: Real-time countdown to the next prayer time (updates every minute)
- 🔔 **Reminder Notifications**: Get notified before prayer time (configurable minutes)
- 🔊 **Adhan Audio**: Optional Adhan sound playback at prayer time (cross-platform)
- 🌍 **Multiple Cities**: Support for 50+ cities worldwide with easy lookup
- 📐 **Calculation Methods**: Support for various calculation methods (Egyptian, Umm Al-Qura, MWL, ISNA, Karachi, Tehran, Dubai, Kuwait, Qatar, Singapore, Turkey, and more)
- ⚙️ **Fully Configurable**: Customize city, country, method, reminder time, and Adhan settings
- 🎯 **Command Palette**: Quick access to view all prayer times for today

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Islamic Prayer Times"
4. Click **Install**

Or install via command line:
```bash
code --install-extension AhmedAlgzery.prayer-times-reminder
```

### From Source

1. Clone or download this extension
2. Open the extension folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch a new Extension Development Host window with the extension loaded

## Quick Start

After installation, the extension will automatically:
- Display the next prayer time in the status bar (bottom-right)
- Update every minute with the countdown
- Show reminders before prayer time (default: 15 minutes)
- Play Adhan audio at prayer time (if enabled)

## Configuration

Open VS Code Settings (`Ctrl+,` or `Cmd+,`) and search for "Prayer Times", or edit your `settings.json`:

```json
{
  "prayer.city": "Cairo",
  "prayer.country": "EG",
  "prayer.method": "Egyptian",
  "prayer.reminderMinutes": 15,
  "prayer.enableAdhan": true
}
```

### Settings

- **prayer.city** (string): City name for prayer times calculation (default: "Cairo")
- **prayer.country** (string): Country code (ISO 3166-1 alpha-2) (default: "EG")
- **prayer.method** (enum): Calculation method:
  - `Egyptian` (default)
  - `UmmAlQura`
  - `MWL` / `MuslimWorldLeague`
  - `ISNA` / `NorthAmerica`
  - `Karachi`
  - `Tehran`
  - `Dubai`
  - `Kuwait`
  - `Qatar`
  - `Singapore`
  - `Turkey`
  - `MoonsightingCommittee`
- **prayer.reminderMinutes** (number): Minutes before prayer to show reminder (0-60, default: 15)
- **prayer.enableAdhan** (boolean): Enable/disable Adhan sound at prayer time (default: true)

## Usage

### Status Bar

The extension displays the next prayer and remaining time in the VS Code status bar:
- Format: `⏰ {PrayerName} in {X} min`
- Example: `⏰ Asr in 23 min`
- Updates every minute automatically
- Click the status bar item to view all prayer times

### Command Palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type:
- **Show Prayer Times** - Opens a popup showing all prayer times for today and the next prayer information

### Reminders

- A notification appears when the configured reminder time is reached (e.g., 15 minutes before prayer)
- The reminder shows: `Reminder: {PrayerName} in {X} minutes`
- Adhan audio plays at the exact prayer time (if enabled)

## Supported Cities

The extension includes a lookup table for 50+ cities worldwide. If your city is not found, it will default to Cairo coordinates. Supported cities include:

- **Egypt**: Cairo, Alexandria, Giza
- **Saudi Arabia**: Mecca, Medina, Riyadh, Jeddah
- **Turkey**: Istanbul, Ankara
- **Indonesia**: Jakarta, Bandung
- **Pakistan**: Karachi, Lahore, Islamabad
- **UAE**: Dubai, Abu Dhabi
- **Malaysia**: Kuala Lumpur
- **UK**: London
- **USA**: New York, Los Angeles, Chicago
- **Canada**: Toronto
- **Australia**: Sydney, Melbourne
- **And many more...**

To add more cities, edit `src/utils/city-lookup.ts` and submit a pull request!

## Adhan Audio

The extension includes support for playing Adhan audio at prayer time:

- **Windows**: Uses PowerShell `SoundPlayer`
- **macOS**: Uses `afplay`
- **Linux**: Uses `paplay` or `aplay` (requires ALSA/PulseAudio)

The extension includes a default `azan.mp3` file. You can replace it with your preferred Adhan audio by placing your own `azan.mp3` file in the extension's `media/` directory.

## Requirements

- VS Code 1.74.0 or higher
- Node.js (for development only)

## Dependencies

- `adhan`: Islamic prayer times calculation library
- `@types/node`: TypeScript definitions for Node.js

## Development

### Project Structure

```
prayer-times-extension/
├── src/
│   ├── extension.ts              # Main entry point
│   ├── services/
│   │   ├── prayer.service.ts     # Prayer time calculations
│   │   └── reminder.service.ts   # Status bar & reminder logic
│   ├── utils/
│   │   ├── audio.ts              # OS-specific audio playback
│   │   └── city-lookup.ts        # Static city coordinates lookup
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── media/
│   └── azan.mp3                  # Adhan audio file
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm install
npm run compile
```

### Watching for Changes

```bash
npm run watch
```

### Testing

1. Open the extension folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Check the status bar for prayer times countdown

## Contributing

Contributions are welcome! Please feel free to:
- Submit issues for bugs or feature requests
- Add more cities to the lookup table
- Improve documentation
- Submit pull requests

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

- Prayer times calculation using [adhan](https://github.com/batoulapps/adhan-js) library
- Audio playback uses native OS commands

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/ahmed-algzery/prayer-times-extension/issues)
- Check the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AhmedAlgzery.prayer-times-reminder) page

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Marketplace

Find this extension on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AhmedAlgzery.prayer-times-reminder)

---

**Made with Ahmed Algzery ❤️ for the Muslim developer community**

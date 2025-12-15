import * as vscode from 'vscode';
import { PrayerService } from './services/prayer.service';
import { ReminderService } from './services/reminder.service';
import { getCoordinates } from './utils/city-lookup';

let reminderService: ReminderService | undefined;

/**
 * Initialize the extension services
 */
function initializeServices(context: vscode.ExtensionContext): void {
  // Dispose existing service if any
  if (reminderService) {
    reminderService.dispose();
  }

  // Get configuration
  const config = vscode.workspace.getConfiguration('prayer');
  const city = config.get<string>('city', 'Cairo');
  const country = config.get<string>('country', 'EG');
  const method = config.get<string>('method', 'Egyptian');
  const reminderMinutes = config.get<number>('reminderMinutes', 15);
  const enableAdhan = config.get<boolean>('enableAdhan', true);

  // Get coordinates for city
  const coordinates = getCoordinates(city, country);

  // Initialize prayer service
  const prayerService = new PrayerService(
    coordinates.latitude,
    coordinates.longitude,
    method
  );

  // Initialize reminder service
  reminderService = new ReminderService(
    prayerService,
    reminderMinutes,
    enableAdhan,
    context.extensionPath
  );

  // Register for disposal
  context.subscriptions.push(reminderService);
}

/**
 * Show prayer times details in a popup
 */
function showPrayerDetails(): void {
  if (!reminderService) {
    vscode.window.showWarningMessage('Prayer Times service is not initialized');
    return;
  }

  const allPrayers = reminderService.getAllPrayerTimes();
  const nextPrayer = reminderService.getNextPrayer();
  const now = new Date();

  // Format prayer times
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Build message
  let message = `🕌 Prayer Times - ${formatDate(now)}\n\n`;
  
  for (const prayer of allPrayers) {
    const isNext = prayer.name === nextPrayer.name;
    const marker = isNext ? '➜' : '  ';
    const timeStr = formatTime(prayer.time);
    message += `${marker} ${prayer.displayName}: ${timeStr}\n`;
  }

  message += `\n⏰ Next: ${nextPrayer.displayName} at ${formatTime(nextPrayer.time)}`;
  
  const remaining = reminderService.getRemainingTime();
  if (remaining.totalSeconds > 0) {
    message += ` (in ${remaining.formatted})`;
  } else {
    message += ' (now)';
  }

  vscode.window.showInformationMessage(message, { modal: true });
}

/**
 * This method is called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Prayer Times extension is now active');

  // Initialize services
  initializeServices(context);

  // Register command to show prayer details
  const showDetailsCommand = vscode.commands.registerCommand(
    'prayer.showDetails',
    showPrayerDetails
  );
  context.subscriptions.push(showDetailsCommand);

  // Listen for configuration changes
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('prayer')) {
      // Reinitialize services with new configuration
      initializeServices(context);
      vscode.window.showInformationMessage('Prayer Times configuration updated');
    }
  });
  context.subscriptions.push(configWatcher);
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate(): void {
  if (reminderService) {
    reminderService.dispose();
    reminderService = undefined;
  }
}


import * as vscode from 'vscode';
import { PrayerService } from './prayer.service';
import { PrayerInfo } from '../types';
import { playAdhan } from '../utils/audio';

export class ReminderService {
  private prayerService: PrayerService;
  private reminderMinutes: number;
  private enableAdhan: boolean;
  private statusBarItem: vscode.StatusBarItem;
  private updateInterval: NodeJS.Timeout | undefined;
  private lastReminderPrayer: string | null = null;
  private lastAdhanPrayer: string | null = null;
  private extensionPath: string;

  constructor(
    prayerService: PrayerService,
    reminderMinutes: number,
    enableAdhan: boolean,
    extensionPath: string
  ) {
    this.prayerService = prayerService;
    this.reminderMinutes = reminderMinutes;
    this.enableAdhan = enableAdhan;
    this.extensionPath = extensionPath;
    
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'prayer.showDetails';
    this.statusBarItem.tooltip = 'Click to view all prayer times';
    this.statusBarItem.show();
    
    // Start updating
    this.start();
  }

  /**
   * Start the reminder service
   */
  private start(): void {
    // Update immediately
    this.updateStatusBar();
    
    // Update every minute (60000 ms)
    this.updateInterval = setInterval(() => {
      this.updateStatusBar();
      this.checkReminders();
    }, 60000);
  }

  /**
   * Update the status bar with next prayer information
   */
  private updateStatusBar(): void {
    try {
      const now = new Date();
      const nextPrayer = this.prayerService.getNextPrayer(now);
      const remaining = this.prayerService.getRemainingTime(nextPrayer.time, now);
      
      if (remaining.totalSeconds > 0) {
        this.statusBarItem.text = `⏰ ${nextPrayer.displayName} in ${remaining.formatted}`;
      } else {
        // Prayer time has arrived
        this.statusBarItem.text = `🕌 ${nextPrayer.displayName} now`;
      }
    } catch (error) {
      this.statusBarItem.text = '⏰ Prayer Times';
      console.error('Error updating status bar:', error);
    }
  }

  /**
   * Check if reminder notification should be shown
   */
  private checkReminders(): void {
    try {
      const now = new Date();
      const nextPrayer = this.prayerService.getNextPrayer(now);
      const remaining = this.prayerService.getRemainingTime(nextPrayer.time, now);
      
      // Check if we're at the reminder threshold
      if (remaining.minutes === this.reminderMinutes && remaining.seconds < 60) {
        // Only show reminder once per prayer
        if (this.lastReminderPrayer !== nextPrayer.name) {
          const reminderMessage = `🕌 Prayer Reminder: ${nextPrayer.displayName} in ${this.reminderMinutes} minute${this.reminderMinutes !== 1 ? 's' : ''}`;
          vscode.window.showInformationMessage(reminderMessage);
          this.lastReminderPrayer = nextPrayer.name;
        }
      }
      
      // Show notification at prayer time
      if (remaining.totalSeconds === 0 && remaining.minutes === 0) {
        // Prayer time has arrived
        if (this.lastAdhanPrayer !== nextPrayer.name) {
          const prayerMessage = `🕌 ${nextPrayer.displayName} time has arrived!`;
          vscode.window.showInformationMessage(prayerMessage);
          
          // Play Adhan if enabled
          if (this.enableAdhan) {
            playAdhan(this.extensionPath);
            this.lastAdhanPrayer = nextPrayer.name;
          }
        }
      }
      
      // Reset reminder flag when prayer time passes (after 1 minute)
      if (remaining.totalSeconds < 0 && Math.abs(remaining.minutes) >= 1) {
        this.lastReminderPrayer = null;
        this.lastAdhanPrayer = null;
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(reminderMinutes: number, enableAdhan: boolean): void {
    this.reminderMinutes = reminderMinutes;
    this.enableAdhan = enableAdhan;
    this.lastReminderPrayer = null; // Reset to allow new reminders
    this.updateStatusBar();
  }

  /**
   * Get all prayer times for display
   */
  public getAllPrayerTimes(): PrayerInfo[] {
    return this.prayerService.getAllPrayerTimes();
  }

  /**
   * Get next prayer information
   */
  public getNextPrayer(): PrayerInfo {
    return this.prayerService.getNextPrayer();
  }

  /**
   * Get remaining time until next prayer
   */
  public getRemainingTime(): ReturnType<typeof this.prayerService.getRemainingTime> {
    const now = new Date();
    const nextPrayer = this.prayerService.getNextPrayer(now);
    return this.prayerService.getRemainingTime(nextPrayer.time, now);
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
    this.statusBarItem.dispose();
  }
}


import * as vscode from "vscode";
import { PrayerService } from "./prayer.service";
import { PrayerInfo } from "../types";
import { playAdhan } from "../utils/audio";
import { formatDate, formatTime } from "../utils/helper";

export class ReminderService {
  private prayerService: PrayerService;
  private reminderMinutes: number;
  private enableAdhan: boolean;
  private timeFormat: "12h" | "24h";
  private statusBarItem: vscode.StatusBarItem;
  private updateInterval: NodeJS.Timeout | undefined;
  private lastReminderPrayer: string | null = null;
  private lastAdhanPrayer: string | null = null;
  private nextFollowUpTime: Date | null = null;
  private followUpPrayerName: string | null = null;
  private extensionPath: string;

  constructor(
    prayerService: PrayerService,
    reminderMinutes: number,
    enableAdhan: boolean,
    extensionPath: string,
    timeFormat: "12h" | "24h" = "12h"
  ) {
    this.prayerService = prayerService;
    this.reminderMinutes = reminderMinutes;
    this.enableAdhan = enableAdhan;
    this.extensionPath = extensionPath;
    this.timeFormat = timeFormat;

    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = "prayer.showDetails";
    this.statusBarItem.tooltip = "Click to view all prayer times";
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
      const remaining = this.prayerService.getRemainingTime(
        nextPrayer.time,
        now
      );

      if (remaining.totalSeconds > 0) {
        this.statusBarItem.text = `⏰ ${nextPrayer.displayName} at ${formatTime(
          nextPrayer.time,
          this.timeFormat
        )}`;
      } else {
        // Prayer time has arrived
        this.statusBarItem.text = `🕌 ${nextPrayer.displayName} now`;
      }
    } catch (error) {
      this.statusBarItem.text = "⏰ Prayer Times";
      console.error("Error updating status bar:", error);
    }
  }

  /**
   * Check if reminder notification should be shown
   */
  private checkReminders(): void {
    try {
      const now = new Date();
      const nextPrayer = this.prayerService.getNextPrayer(now);
      const remaining = this.prayerService.getRemainingTime(
        nextPrayer.time,
        now
      );

      // Check if we're at the reminder threshold
      if (
        remaining.minutes === this.reminderMinutes &&
        remaining.seconds < 60
      ) {
        // Only show reminder once per prayer
        if (this.lastReminderPrayer !== nextPrayer.name) {
          const reminderMessage = `🕌 Prayer Reminder: ${
            nextPrayer.displayName
          } in ${this.reminderMinutes} minute${
            this.reminderMinutes !== 1 ? "s" : ""
          }`;
          vscode.window.showInformationMessage(reminderMessage);
          this.lastReminderPrayer = nextPrayer.name;
        }
      }

      // Check if prayer time has arrived (within 1 minute window)
      // Since we check every 60 seconds, we need a window rather than exact match
      if (remaining.totalSeconds <= 60 && remaining.minutes === 0) {
        // Prayer time has arrived (or will arrive within the next minute)
        if (this.lastAdhanPrayer !== nextPrayer.name) {
          const prayerMessage = `🕌 ${nextPrayer.displayName} time has arrived!`;
          vscode.window.showInformationMessage(prayerMessage);

          // Play Adhan if enabled
          if (this.enableAdhan) {
            playAdhan(this.extensionPath);
          }

          // Mark this prayer as notified (regardless of adhan setting)
          this.lastAdhanPrayer = nextPrayer.name;

          // Schedule follow-up in 20 minutes
          this.nextFollowUpTime = new Date(Date.now() + 20 * 60 * 1000);
          this.followUpPrayerName = nextPrayer.displayName;
        }
      }

      // Check for follow-up
      if (this.nextFollowUpTime && now >= this.nextFollowUpTime) {
        const prayerName = this.followUpPrayerName;
        // Reset immediately to avoid repeated triggers
        this.nextFollowUpTime = null;

        vscode.window
          .showInformationMessage(`Did you pray ${prayerName}?`, "Yes", "No")
          .then((selection) => {
            if (selection === "No") {
              // Ask again in 20 minutes
              this.nextFollowUpTime = new Date(Date.now() + 20 * 60 * 1000);
            } else if (selection === "Yes") {
              // Done
              this.followUpPrayerName = null;
            }
          });
      }

      // If we've moved to a different prayer, reset flags
      if (this.lastAdhanPrayer && this.lastAdhanPrayer !== nextPrayer.name) {
        this.lastReminderPrayer = null;
        this.lastAdhanPrayer = null;
      }
    } catch (error) {
      console.error("Error checking reminders:", error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(
    reminderMinutes: number,
    enableAdhan: boolean,
    timeFormat: "12h" | "24h" = "12h"
  ): void {
    this.reminderMinutes = reminderMinutes;
    this.enableAdhan = enableAdhan;
    this.timeFormat = timeFormat;
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
  public getRemainingTime(): ReturnType<
    typeof this.prayerService.getRemainingTime
  > {
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

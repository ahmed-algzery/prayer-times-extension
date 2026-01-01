import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';

/**
 * Play Adhan audio file using OS-specific command
 * @param extensionPath Path to the extension directory
 */
export function playAdhan(extensionPath: string): void {
  const adhanPath = path.join(extensionPath, 'media', 'azan.mp3');
  
  // Check if file exists
  if (!fs.existsSync(adhanPath)) {
    vscode.window.showWarningMessage(
      `Adhan audio file not found at: ${adhanPath}. Please ensure azan.mp3 exists in the media folder.`
    );
    return;
  }
  
  const platform = process.platform;
  let command: string;
  
  if (platform === 'win32') {
    // Windows: Use PowerShell with Media.MediaPlayer for MP3 support
    // System.Media.SoundPlayer only supports WAV
    const escapedPath = adhanPath.replace(/'/g, "''");
    command = `powershell -Command "$player = New-Object -ComObject WMPlayer.OCX; $player.URL = '${escapedPath}'; $player.controls.play(); while ($player.playState -eq 3) { Start-Sleep -Milliseconds 100 }"`;
  } else if (platform === 'darwin') {
    // macOS: Use afplay
    command = `afplay "${adhanPath}"`;
  } else if (platform === 'linux') {
    // Linux: Try mpg123, ffplay, paplay, then aplay
    command = `mpg123 "${adhanPath}" 2>/dev/null || ffplay -nodisp -autoexit "${adhanPath}" 2>/dev/null || paplay "${adhanPath}" 2>/dev/null || aplay "${adhanPath}" 2>/dev/null || echo "Audio playback failed"`;
  } else {
    vscode.window.showWarningMessage(`Adhan playback not supported on platform: ${platform}`);
    return;
  }
  
  // Execute the command asynchronously
  child_process.exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
    if (error) {
      // Don't show error if it's just a non-zero exit (some players do this)
      if (error.code && error.code !== 0 && !stdout.includes('Audio playback failed')) {
        console.error('Adhan playback error:', error.message);
        // Only show warning for critical errors
        if (error.code !== 1) {
          vscode.window.showWarningMessage(
            `Failed to play Adhan. Please check if audio player is installed. Error: ${error.message}`
          );
        }
      }
    }
  });
}


#!/usr/bin/env node

/**
 * Script to convert SVG icon to PNG for VS Code extension
 * Requires: sharp (npm install sharp)
 */

const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'images', 'icon.svg');
const pngPath = path.join(__dirname, '..', 'images', 'icon.png');

try {
  // Try to use sharp if available
  const sharp = require('sharp');
  
  fs.readFile(svgPath, (err, data) => {
    if (err) {
      console.error('Error reading SVG file:', err);
      process.exit(1);
    }
    
    sharp(data)
      .resize(128, 128)
      .png()
      .toFile(pngPath)
      .then(() => {
        console.log('✅ Successfully converted icon.svg to icon.png (128x128)');
      })
      .catch((error) => {
        console.error('Error converting:', error);
        console.log('\n💡 Alternative: Use an online converter:');
        console.log('   https://cloudconvert.com/svg-to-png');
        process.exit(1);
      });
  });
} catch (error) {
  console.log('⚠️  sharp not installed. Installing...');
  console.log('   Run: npm install sharp');
  console.log('\n💡 Or use an online converter:');
  console.log('   https://cloudconvert.com/svg-to-png');
  console.log('   Upload images/icon.svg and download as 128x128 PNG');
}


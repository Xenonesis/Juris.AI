import fs from 'fs';

// Function to validate ICO file
function validateIco(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check if file is at least 6 bytes (minimum ICO header size)
    if (buffer.length < 6) {
      console.log('File is too small to be a valid ICO');
      return false;
    }
    
    // Check reserved bytes (must be 0)
    const reserved = buffer.readUInt16LE(0);
    if (reserved !== 0) {
      console.log('Invalid reserved bytes in ICO header');
      return false;
    }
    
    // Check image type (must be 1 for ICO)
    const imageType = buffer.readUInt16LE(2);
    if (imageType !== 1) {
      console.log('Invalid image type in ICO header');
      return false;
    }
    
    // Check number of images
    const imageCount = buffer.readUInt16LE(4);
    if (imageCount === 0) {
      console.log('No images in ICO file');
      return false;
    }
    
    console.log(`Valid ICO file with ${imageCount} image(s)`);
    return true;
  } catch (error) {
    console.error('Error validating ICO file:', error);
    return false;
  }
}

// Validate the favicon.ico file
const isValid = validateIco('public/favicon.ico');
console.log(`ICO file is ${isValid ? 'valid' : 'invalid'}`);
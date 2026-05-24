/**
 * Quick test: uploads a tiny text file to Google Drive and prints the link.
 * Run with: node testDrive.js
 * Delete this file after testing.
 */
require('dotenv').config();
const { uploadToDrive } = require('./utils/driveUpload');

(async () => {
  try {
    console.log('Testing Drive upload...');
    console.log('Service account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Folder ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);

    const testBuffer = Buffer.from('Meipuratchi Drive upload test — OK');
    const url = await uploadToDrive(testBuffer, 'test-upload.txt', 'text/plain');

    console.log('\n✅ Upload successful!');
    console.log('Drive link:', url);
  } catch (err) {
    console.error('\n❌ Upload failed:', err.message);
    if (err.errors) console.error('Details:', JSON.stringify(err.errors, null, 2));
  }
})();

/**
 * driveUpload.js
 * Uploads a file buffer to Google Drive using a Service Account.
 * Returns the public shareable link.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  – service account email
 *   GOOGLE_PRIVATE_KEY            – private key (with literal \n for newlines)
 *   GOOGLE_DRIVE_FOLDER_ID        – target folder ID (optional; uploads to root if omitted)
 */

const { google } = require('googleapis');
const { Readable } = require('stream');

/**
 * Convert a Buffer to a Node.js Readable stream.
 */
function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Build an authenticated Google Drive client using Service Account credentials.
 */
function getDriveClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey  = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!clientEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in environment variables');
  }
  if (!privateKey || !privateKey.includes('PRIVATE KEY')) {
    throw new Error('GOOGLE_PRIVATE_KEY is not set or malformed in environment variables');
  }

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/drive.file']
  );

  return google.drive({ version: 'v3', auth });
}

/**
 * Upload a file to Google Drive.
 *
 * @param {Buffer}  fileBuffer   - raw file bytes
 * @param {string}  originalName - original filename (e.g. "marksheet.pdf")
 * @param {string}  mimeType     - MIME type (e.g. "application/pdf")
 * @returns {Promise<string>}    - public shareable URL
 */
async function uploadToDrive(fileBuffer, originalName, mimeType) {
  const drive = getDriveClient();

  const fileMetadata = {
    name: originalName,
    ...(process.env.GOOGLE_DRIVE_FOLDER_ID && {
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    }),
  };

  const media = {
    mimeType,
    body: bufferToStream(fileBuffer),
  };

  // Upload the file
  const { data } = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink',
    // Required to allow placing files in a shared folder
    supportsAllDrives: true,
  });

  // Make it publicly readable (anyone with the link can view)
  await drive.permissions.create({
    fileId: data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
    supportsAllDrives: true,
  });

  // Return the shareable view link
  return data.webViewLink;
}

module.exports = { uploadToDrive };

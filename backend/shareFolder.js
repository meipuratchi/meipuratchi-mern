/**
 * shareFolder.js  — paste-code version (no redirect server needed)
 * 
 * Steps:
 *  1. Run: node shareFolder.js
 *  2. Open the printed URL in your browser
 *  3. Log in & allow access
 *  4. You'll land on a page that says "This site can't be reached" — that's fine
 *  5. Copy the "code=..." value from the URL bar and paste it here when prompted
 */

const { google } = require('googleapis');
const path  = require('path');
const fs    = require('fs');
const readline = require('readline');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const CLIENT_SECRET_PATH = 'C:\\Users\\acer\\Downloads\\client_secret_748168354179-2oh66k2ver3hcb63bqu8h2661ttutmc1.apps.googleusercontent.com.json';
const TOKEN_PATH   = path.resolve(__dirname, 'oauth_token.json');
const FOLDER_ID    = process.env.GOOGLE_DRIVE_FOLDER_ID;
const SA_EMAIL     = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // shows code on screen — no server needed

const SCOPES = ['https://www.googleapis.com/auth/drive'];

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

async function getOAuthClient() {
  const creds = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));
  const { client_id, client_secret } = creds.web || creds.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 1: Open this URL in your browser:');
  console.log('\n' + authUrl + '\n');
  console.log('STEP 2: Log in with your Google account & click Allow');
  console.log('STEP 3: Copy the code shown on screen and paste it below');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const code = await ask('Paste the code here: ');
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Token saved.\n');
  return oAuth2Client;
}

async function main() {
  console.log('Folder ID :', FOLDER_ID);
  console.log('Sharing with:', SA_EMAIL);

  const auth  = await getOAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: FOLDER_ID,
    requestBody: { role: 'writer', type: 'user', emailAddress: SA_EMAIL },
    sendNotificationEmail: false,
  });

  console.log('✅ Folder shared with service account!');
  console.log('\nNow run: node testDrive.js');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
  process.exit(1);
});

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load client secrets from a local file.
const CLIENT_SECRET_PATH = path.join(__dirname, '..', 'config', 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, '..', 'config', 'token.json');

// Create a new instance of the Google Drive API client.
const drive = google.drive('v3');

// Uploads the journal document to the user's Google Drive account.
async function uploadJournalDocument(journal) {
  try {
    // Load client secrets from a local file.
    const credentials = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));

    // Authorize the client with the Google Drive API.
    const auth = await authorize(credentials);

    // Create a new file in the user's Google Drive account.
    const fileMetadata = {
      name: `${journal.title}.txt`,
      parents: [journal.folderId],
      mimeType: 'text/plain'
    };
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(journal.filePath)
    };
    const res = await drive.files.create({
      auth,
      resource: fileMetadata,
      media,
      fields: 'id'
    });

    console.log(`Journal document uploaded to Google Drive with ID: ${res.data.id}`);
  } catch (err) {
    console.error(`Error uploading journal document to Google Drive: ${err}`);
  }
}

// Authorizes the client with the Google Drive API.
async function authorize(credentials) {
  try {
    // Load client secrets from a local file.
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    let token = fs.readFileSync(TOKEN_PATH);
    if (!token) {
      token = await getNewToken(oAuth2Client);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    console.error(`Error authorizing client with Google Drive API: ${err}`);
  }
}

// Gets a new access token for the client.
async function getNewToken(oAuth2Client) {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file']
    });
    console.log(`Authorize this app by visiting this url: ${authUrl}`);

    const code = await new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        resolve(code);
      });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    console.log(`Token obtained: ${JSON.stringify(tokens)}`);
    return JSON.stringify(tokens);
  } catch (err) {
    console.error(`Error getting new access token: ${err}`);
  }
}

module.exports = {
  uploadJournalDocument
};
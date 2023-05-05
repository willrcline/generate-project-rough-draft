// Import necessary modules
const { google } = require('googleapis');
const fs = require('fs');

// Load credentials from config file
const CREDENTIALS = require('../config/config.js').googleDocsCredentials;

// Create a new OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uris[0]
);

// Set the access token for the client
oAuth2Client.setCredentials(CREDENTIALS.token);

// Define the Google Docs API version to use
const DOCS_API_VERSION = 'v1';

// Define the Google Docs API endpoint
const DOCS_API_ENDPOINT = 'https://docs.googleapis.com/' + DOCS_API_VERSION;

// Define the mime type for Google Docs
const GOOGLE_DOCS_MIME_TYPE = 'application/vnd.google-apps.document';

// Define the folder ID for where the journal documents will be stored
const JOURNAL_FOLDER_ID = 'insert_folder_id_here';

// Define the function to upload the journal document to Google Docs
async function uploadJournalDocument(journal) {
  try {
    // Create a new Google Docs document
    const doc = await google.docs(DOCS_API_VERSION).documents.create({
      auth: oAuth2Client,
      resource: {
        title: `Journal - ${journal.date}`,
        parents: [JOURNAL_FOLDER_ID],
        mimeType: GOOGLE_DOCS_MIME_TYPE
      }
    });

    // Append the journal entries to the document
    const requests = journal.entries.map(entry => ({
      insertText: {
        text: `${entry}\n`,
        endOfSegmentLocation: {}
      }
    }));
    await google.docs(DOCS_API_VERSION).documents.batchUpdate({
      auth: oAuth2Client,
      documentId: doc.data.documentId,
      resource: {
        requests
      }
    });

    // Export the document as a Microsoft Word file
    const exportRes = await google.docs(DOCS_API_VERSION).documents.export({
      auth: oAuth2Client,
      documentId: doc.data.documentId,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Save the exported file to disk
    const filePath = `./journals/journal-${journal.date}.docx`;
    const file = fs.createWriteStream(filePath);
    exportRes.data.pipe(file);
    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });

    // Return the file path
    return filePath;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Export the uploadJournalDocument function
module.exports = {
  uploadJournalDocument
};
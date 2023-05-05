// Import necessary modules
const { google } = require('googleapis');
const fs = require('fs');

// Load client secrets from a local file
const credentials = JSON.parse(fs.readFileSync('google-credentials.json'));

// Create a new OAuth2 client with the credentials
const authClient = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

// Set the access token to the client
authClient.setCredentials({
  access_token: credentials.access_token,
  refresh_token: credentials.refresh_token
});

// Define the Google Docs API version
const docs = google.docs({ version: 'v1', auth: authClient });

// Define the function to upload the journal document to Google Docs API
async function uploadJournal(journal) {
  try {
    // Create a new document
    const document = await docs.documents.create({
      title: 'My Daily Journal'
    });

    // Get the document ID
    const documentId = document.data.documentId;

    // Get the body of the document
    const body = await docs.documents.get({
      documentId: documentId
    });

    // Append the journal entries to the document
    for (let i = 0; i < journal.length; i++) {
      const entry = journal[i];
      const text = entry.date + ': ' + entry.text;
      const requests = [
        {
          insertText: {
            text: text + '\n',
            endOfSegmentLocation: {}
          }
        }
      ];
      await docs.documents.batchUpdate({
        documentId: documentId,
        resource: {
          requests: requests
        }
      });
    }

    // Export the document as a Microsoft Word document
    const exportOptions = {
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    const response = await docs.documents.export({
      documentId: documentId,
      mimeType: exportOptions.mimeType
    });

    // Save the exported document to a file
    const file = fs.createWriteStream('journal.docx');
    response.data.pipe(file);
    console.log('Journal document saved to journal.docx');
  } catch (error) {
    console.error(error);
  }
}

// Export the function
module.exports = {
  uploadJournal: uploadJournal
};
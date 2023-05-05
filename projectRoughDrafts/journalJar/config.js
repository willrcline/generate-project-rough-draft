// config.js

// Twilio API credentials
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const twilioPhoneNumber = 'your_twilio_phone_number';

// Google Docs API credentials
const googleClientId = 'your_google_client_id';
const googleClientSecret = 'your_google_client_secret';
const googleAccessToken = 'your_google_access_token';
const googleRefreshToken = 'your_google_refresh_token';
const googleFolderId = 'your_google_folder_id';

// Environment variables
const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV || 'development';

// Export configuration settings
module.exports = {
  twilio: {
    accountSid,
    authToken,
    twilioPhoneNumber
  },
  googleDocs: {
    googleClientId,
    googleClientSecret,
    googleAccessToken,
    googleRefreshToken,
    googleFolderId
  },
  environment,
  port
};
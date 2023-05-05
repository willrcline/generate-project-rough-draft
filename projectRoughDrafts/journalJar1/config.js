// config.js

// Twilio API credentials
const TWILIO_ACCOUNT_SID = "your_twilio_account_sid";
const TWILIO_AUTH_TOKEN = "your_twilio_auth_token";
const TWILIO_PHONE_NUMBER = "your_twilio_phone_number";

// Google Docs API credentials
const GOOGLE_CLIENT_ID = "your_google_client_id";
const GOOGLE_CLIENT_SECRET = "your_google_client_secret";
const GOOGLE_REDIRECT_URI = "your_google_redirect_uri";
const GOOGLE_REFRESH_TOKEN = "your_google_refresh_token";

// Scheduler settings
const SCHEDULER_TIMEZONE = "your_timezone";
const SCHEDULER_HOUR = 9; // 9am
const SCHEDULER_MINUTE = 0;

// Export the configuration settings
module.exports = {
  twilio: {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
    phoneNumber: TWILIO_PHONE_NUMBER
  },
  googleDocs: {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
    refreshToken: GOOGLE_REFRESH_TOKEN
  },
  scheduler: {
    timezone: SCHEDULER_TIMEZONE,
    hour: SCHEDULER_HOUR,
    minute: SCHEDULER_MINUTE
  }
};
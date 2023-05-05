// Import dotenv to load environment variables
require('dotenv').config();

// Export configuration object
module.exports = {
  // Twilio API keys
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },

  // Google Docs API keys
  googleDocs: {
    clientId: process.env.GOOGLE_DOCS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DOCS_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_DOCS_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_DOCS_REFRESH_TOKEN
  },

  // Scheduler settings
  scheduler: {
    // Timezone to use for scheduling (e.g. America/New_York)
    timezone: process.env.SCHEDULER_TIMEZONE,

    // Time of day to send journal prompts (in 24-hour format, e.g. 18:00 for 6:00 PM)
    promptTime: process.env.SCHEDULER_PROMPT_TIME
  }
};
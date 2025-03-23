const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv to load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Configuration object for the application
const config = {
  appPort: process.env.PORT,
  paystackSecret: process.env.PAYSTACK_SECRET_KEY,
  paystackUrl: process.env.PAYSTACK_BASEURL,
};

module.exports = config;

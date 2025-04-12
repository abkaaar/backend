require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  const tokenKey = process.env.TOKEN_KEY;

  if (!tokenKey) {
    throw new Error('TOKEN_KEY is missing from environment variables');
  }

  return jwt.sign({ id }, tokenKey, {
    expiresIn: 2 * 24 * 60 * 60,  // expires in 2 days
  });
};


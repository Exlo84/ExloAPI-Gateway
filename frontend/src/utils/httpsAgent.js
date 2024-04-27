const https = require('https');

// Conditional logic to ensure secure configuration in production
const agent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV !== 'development' // Ensure SSL/TLS certificate validation in production
});

module.exports = agent;
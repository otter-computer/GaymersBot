require('dotenv').config();
const Bot = require('./Bot');

const GaymersBot = new Bot();

// Handle graceful shutdowns
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup() {
  GaymersBot.destroy();
  process.exit();
}

GaymersBot.connect();

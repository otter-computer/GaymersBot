const Bot = require('./Bot');
const express = require('express');

const GaymersBot = new Bot();

// Start webserver
// Required for running on Azure WebApp
const webserver = express();
webserver.get('/', (req, res) => res.send('ping'));
webserver.listen(8080, () => {});

// Handle graceful shutdowns
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup() {
  GaymersBot.destroy();
  process.exit();
}

GaymersBot.connect();

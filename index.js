const http = require('http');
const Bot = require(`./Bot`);

const GaymersBot = new Bot();

// Handle graceful shutdowns
process.on(`SIGINT`, cleanup);
process.on(`SIGTERM`, cleanup);

function cleanup() {
  GaymersBot.destroy();
  process.exit();
}

// Basic HTTP server to keep Azure App Service happy
if (process.env.NODE_ENV === `production`) {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('GaymersBot is alive!');
  }).listen(8080);
}

GaymersBot.connect();

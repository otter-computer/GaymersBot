const Appinsights = require('applicationinsights');

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  Appinsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).setAutoCollectConsole(true, true).start();
}

const Discord = require('discord.js');
const express = require('express');
const utils = require('./utils/discordHelpers');
require('./utils/javascriptHelpers');

// Load env vars
require('dotenv').config();

// Auth token
const token = process.env.AUTH_TOKEN;
if (!token) {
  console.log('No auth token found, please set the AUTH_TOKEN environment variable.\n');
  process.exit();
}

// Handle graceful shutdowns
function cleanup() {
  if (bot)
    bot.destroy();
  console.log('Bot shut down');
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start webserver
const webserver = express();
webserver.get('/', (req, res) => res.send('ping'));
webserver.listen(8080, () => {});

// Import Events
const events = require('./events/index');

// Init bot
const bot = new Discord.Client();
bot.on('ready', () => {
  console.log('Bot connected');
});

// Handle messages
bot.on('message', message => {
  try {
    utils.messageHandler(bot, message);
  } catch (e) {
    console.error(e.stack);
  }
});

console.log('Bot started');

bot.login(token);

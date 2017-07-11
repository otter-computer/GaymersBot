/* *
 * DiscoBot - Gaymers Discord Bot
 * Copyright (C) 2015 - 2017 DiscoBot Authors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * */
let appConfig = {};

try {
  appConfig = require('./config');
} catch (error) {
  if (error.code == 'MODULE_NOT_FOUND') {
    console.error('config.json not found');
  } else {
    console.error('Error processing config.json', error);
  }

  console.warn('Will attempt to use environment variables.');

  appConfig.AUTH_TOKEN = process.env.AUTH_TOKEN;
  appConfig.APIGW_DISCOBOT_X_API_KEY = process.env.APIGW_DISCOBOT_X_API_KEY;
  appConfig.MINECRAFT_CHAT_CHANNEL = process.env.MINECRAFT_CHAT_CHANNEL;
  appConfig.SQS_ACCESS_KEY = process.env.SQS_ACCESS_KEY;
  appConfig.SQS_SECRET_KEY = process.env.SQS_SECRET_KEY;
  appConfig.SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
  appConfig.USE_AWS_SQS = true;

  if (!process.env.USE_AWS_SQS) {
    appConfig.USE_AWS_SQS = false;
  }
}

if (!appConfig.USE_AWS_SQS) {
  console.warn('SQS is disabled by configuration, message queues will not operate.');
}

// exports config so it can be required in other modules
module.exports.appConfig = appConfig;

const Discord = require('discord.js');
const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
const utils = require('./utils/discordHelpers');

require('log-timestamp');
require('./utils/javascriptHelpers');

// SQS Setup
let sqs;

if (appConfig.USE_AWS_SQS) {
  AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: appConfig.SQS_ACCESS_KEY,
    secretAccessKey: appConfig.SQS_SECRET_KEY
  });

  sqs = Consumer.create({
    queueUrl: process.env.SQS_QUEUE_URL,
    handleMessage: (message, done) => {
      msgq.messageReceived.process(bot, message);
      done();
    },
    sqs: new AWS.SQS()
  });

  sqs.on('error', (err) => {
    console.error(err.message);
  });
}

// Auth token
const token = appConfig.AUTH_TOKEN;
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

// Utilities
const updateAPI = require('./utils/updateAPI');

// Import Commands
const commands = require('./commands/index');

// Import Events
const events = require('./events/index');

// Events
const msgq = {};

// Import events
if (appConfig.USE_AWS_SQS) {
  msgq.messageReceived = require('./msgq/messageReceived');
}

// Init bot
const bot = new Discord.Client();
bot.on('ready', () => {
  console.log('Bot connected');
  if (appConfig.USE_AWS_SQS) {
    sqs.start();
  }
});

// Handle messages
bot.on('message', message => {
  try {
    utils.messageHandler(bot, message);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member joined
bot.on('guildMemberAdd', (member) => {
  try {
    events.memberJoined.process(bot, member);
    //updateAPI.updateJoiner(member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member left
bot.on('guildMemberRemove', (member) => {
  try {
    events.memberLeft.process(bot, member);
    updateAPI.updateLeaver(member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member banned
bot.on('guildBanAdd', (guild, member) => {
  try {
    events.memberBanned.process(bot, guild, member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member unbanned
bot.on('guildBanRemove', (guild, member) => {
  try {
    events.memberUnbanned.process(bot, guild, member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member update (Added/removed role, changed nickname)
bot.on('guildMemberUpdate', (oldMember, newMember) => {
  try {
    events.memberUpdated.process(bot, oldMember, newMember);
    updateAPI.updateRole(newMember);
  } catch (e) {
    console.error(e.stack);
  }
});

// Message deleted
bot.on('messageDelete', (message) => {
  try {
    events.messageDeleted.process(bot, message);
  } catch (e) {
    console.error(e.stack);
  }
});

// Status update
//bot.on('presenceUpdate', (oldMember, newMember) => {
//  try {
//    updateAPI.updatePresence(newMember);
//  } catch (e) {
//    console.error(e.stack);
//  }
//});


// Message edited
//bot.on('messageUpdate', (oldMessage, newMessage) => {
//  try {
//    events.messageUpdated.process(bot, oldMessage, newMessage);
//  } catch (e) {
//    console.error(e.stack);
//  }
//});

console.log('Bot started');

bot.login(token);

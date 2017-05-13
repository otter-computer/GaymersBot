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

const Discord = require('discord.js');
const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
const roles = require('./roles');

require('log-timestamp');
require('./utils');

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

// Commands
const commands = {};

// Import commands
commands.avatar = require('./commands/avatar');
commands.boop = require('./commands/boop');
commands.choose = require('./commands/choose');
commands.createrole = require('./commands/createrole');
commands.event = require('./commands/event');
commands.events = require('./commands/events');
commands.help = require('./commands/help');
commands.hug = require('./commands/hug');
commands.joined = require('./commands/joined');
commands.magic8ball = require('./commands/magic8ball');
commands.member = require('./commands/member');
commands.quote = require('./commands/quote');
commands.regions = require('./commands/regions');
commands.role = require('./commands/role');
commands.set18 = require('./commands/set18');
commands.setregion = require('./commands/setregion');
commands.slap = require('./commands/slap');
commands.spray = require('./commands/spray');
commands.status = require('./commands/status');
commands.stream = require('./commands/stream');
commands.under18 = require('./commands/under18');
commands.unset18 = require('./commands/unset18');
commands.unsetregion = require('./commands/unsetregion');

// Export commands for use in other modules (help)
module.exports.commands = commands;

// Events
const events = {};

// Import events
events.memberBanned = require('./events/memberBanned');
events.memberJoined = require('./events/memberJoined');
events.memberLeft = require('./events/memberLeft');
events.memberUnbanned = require('./events/memberUnbanned');
events.memberUpdated = require('./events/memberUpdated');
events.messageDeleted = require('./events/messageDeleted');
events.messageUpdated = require('./events/messageUpdated');

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

/**
 * Return `true` if the command is allowed in this channel, `false` if not.
 * Will DM the user and delete the message if not.
 *
 * @param command
 * @param message
 * @returns {boolean}
 */
function commandValidInChannel(command, message) {
  if (command.onlyIn.includes(message.channel.name)) {
    return true;
  }

  // Complain to the user about their mistake
  const validChannels = [];
  command.onlyIn.forEach(channelName => {
    const channel = message.guild.channels.find('name', channelName);
    // If that channel doesn't exist on this server, leave it out
    if (!channel) {
      return;
    }

    // If the user can't read messages in that channel, leave it out
    if (!channel.permissionsFor(message.member)
        .has('READ_MESSAGES')) {
      return;
    }

    validChannels.push('`' + channelName + '`');
  });

  if (validChannels.length === 0) {
    message.member.send('Sorry, that command can\'t be used in ' +
      'that channel.');
  } else if (validChannels.length === 1) {
    message.member.send('Sorry, that command can only be used ' +
      'in ' + validChannels[0] + '.');
  } else {
    message.member.send('Sorry, that command can only be used in ' +
      'the following channels: ' + validChannels.join(', ') + '.');
  }

  // Remove the problem message
  message.delete()
    .catch(reason => {
      // TODO Error handler
      console.error(reason);
    });

  return false;
}

function messageHandler(message) {
  // Ignore bot messages
  if (message.author.bot) {
    return;
  }

  // Commands start with '!'
  if (message.content[0] !== '!') {
    return;
  }

  const commandText = message.content.split(' ')[0].substring(1).toLowerCase();
  const command = commands[commandText];

  // Check that the command exists
  if (!command) {
    return;
  }

  // If a command isn't allowed in a DM (or doesn't have allowDM defined),
  // make sure we're in a guild.
  if (!command.allowDM && !message.guild) {
    message.reply('Sorry, I can only do that on a server. :frowning2:');
    return;
  }

  // Checks that are only needed on a server
  if (message.guild) {
    // Check that the user is allowed to use the bot
    let shouldIgnoreMessage = true;

    // Check that the bot has any required roles at all
    if (roles.REQUIRED_TO_USE_BOT.length > 0) {
      // Try to find a common role between the required list and the
      // user's roles
      roles.REQUIRED_TO_USE_BOT.forEach((requiredRole) => {
        if (message.member.roles.findKey('name', requiredRole)) {
          shouldIgnoreMessage = false;
        }
      });
    } else {
      shouldIgnoreMessage = false;
    }

    // Check that the user is not part of a role that is banned from bot usage
    roles.BANNED_FROM_BOT.forEach((bannedRole) => {
      if (message.member.roles.findKey('name', bannedRole)) {
        shouldIgnoreMessage = true;
      }
    });

    if (shouldIgnoreMessage) {
      return;
    }

    // If the command can only be used in certain channels, check that we're in
    // one of those channels
    if (command.onlyIn && command.onlyIn.length > 0) {
      if (!commandValidInChannel(command, message)) {
        return;
      }
    }
  }

  // If the command requires roles, check that the user has one of them
  if (command.requireRoles) {
    // A command can't require roles and support DMs.
    // This is a programmer error.
    if (!message.guild) {
      // TODO: Programmer error
      return;
    }

    let satisfiesRoles = false;

    // Loop through the roles needed by the command and see if the user
    // has any of them.
    command.requireRoles.forEach((role) => {
      if (message.member.roles.findKey('name', role)) {
        satisfiesRoles = true;
      }
    });

    if (!satisfiesRoles) {
      message.channel.send('I\'m sorry ' + message.author + ', I\'m ' +
        'afraid I can\'t do that.');
      return;
    }
  }

  command.process(bot, message);
}

// Handle messages
bot.on('message', message => {
  try {
    messageHandler(message);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member joined
bot.on('guildMemberAdd', (member) => {
  try {
    events.memberJoined.process(bot, member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member left
bot.on('guildMemberRemove', (member) => {
  try {
    events.memberLeft.process(bot, member);
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

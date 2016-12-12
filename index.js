const cron = require('node-cron');
const Discord = require('discord.js');
const firebase = require('firebase');
const moment = require('moment');

const format = require('./momentFormat');
const roles = require('./roles');

require('./utils');

// Auth token
const token = process.env.AUTH_TOKEN;
if (!token) {
  console.log('No auth token found, please set the AUTH_TOKEN environment variable.\n');
  process.exit();
}

// Debug mode
let debug = false;
if (process.env.APP_DEBUG === 'true') debug = true;

// Time
const startTime = Date.now();

// Handle graceful shutdowns
function cleanup() {
  if (bot)
    bot.destroy();
  console.log('Bot shutting down.');
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Firebase
const config = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

firebase.initializeApp(config);

// Commands
const commands = {};

// Import commands
commands.avatar = require('./commands/avatar');
commands.binnysux = require('./commands/binnysux');
commands.boop = require('./commands/boop');
commands.cat = require('./commands/cat');
commands.choose = require('./commands/choose');
commands.getinfo = require('./commands/getinfo');
commands.help = require('./commands/help');
commands.hug = require('./commands/hug');
commands.joined = require('./commands/joined');
commands.magic8ball = require('./commands/magic8ball');
commands.penguin = require('./commands/penguin');
commands.regions = require('./commands/regions');
commands.role = require('./commands/role');
commands.set18 = require('./commands/set18');
commands.setinfo = require('./commands/setinfo');
commands.setregion = require('./commands/setregion');
commands.slap = require('./commands/slap');
commands.spray = require('./commands/spray');
commands.unset18 = require('./commands/unset18');
commands.unsetinfo = require('./commands/unsetinfo');
commands.unsetregion = require('./commands/unsetregion');
commands.timeout = require('./commands/timeout');

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

// Cron
const cronJobs = {};

// Import cron tasks
cronJobs.timeout = require('./cronjobs/check-timeout');

// Cron
cron.schedule('*/5 * * * *', function() {
  if (debug) console.log('Checking for expired timeouts');
  cronJobs.timeout.process(bot);
}, true);

// Init bot
const bot = new Discord.Client();
bot.on('ready', () => {
  console.log('Bot ready!');
});

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

  // Check that the user is allowed to use the bot (not necessary
  // outside of a guild)
  if (message.guild) {
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
      message.channel.sendMessage('I\'m sorry ' + message.author + ', I\'m ' +
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
bot.on('guildMemberAdd', (guild, member) => {
  try {
    events.memberJoined.process(bot, guild, member);
  } catch (e) {
    console.error(e.stack);
  }
});

// Member left
bot.on('guildMemberRemove', (guild, member) => {
  try {
    events.memberLeft.process(bot, guild, member);
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
bot.on('guildMemberUpdate', (guild, oldMember, newMember) => {
  try {
    events.memberUpdated.process(bot, guild, oldMember, newMember);
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

// Login
if (debug) {
  console.log('Token: ', token);
  console.log('Start time: ', moment(startTime).format(format));
}

bot.login(token);

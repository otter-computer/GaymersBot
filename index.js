const Discord = require('discord.js');
const firebase = require('firebase');
const moment = require('moment');
const format = require('./momentFormat');

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

// Firebase
const config = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

firebase.initializeApp(config);

// Commands
let commands = {};

// Import commands
commands.avatar = require('./commands/avatar');
commands.cat = require('./commands/cat');
commands.choose = require('./commands/choose');
commands.getinfo = require('./commands/getinfo');
commands.help = require('./commands/help');
commands.hug = require('./commands/hug');
commands.joined = require('./commands/joined');
commands.magic8ball = require('./commands/magic8ball');
commands.penguin = require('./commands/penguin');
commands.role = require('./commands/role');
commands.set18 = require('./commands/set18');
commands.setinfo = require('./commands/setinfo');
commands.setregion = require('./commands/setregion');
commands.slap = require('./commands/slap');
commands.spray = require('./commands/spray');
commands.unset18 = require('./commands/unset18');
commands.unsetinfo = require('./commands/unsetinfo');
commands.unsetregion = require('./commands/unsetregion');

// Events
let events = {};

// Import events
events.memberJoined = require('./events/memberJoined');
events.memberLeft = require('./events/memberLeft');
events.memberUpdated = require('./events/memberUpdated');
events.messageDeleted = require('./events/messageDeleted');
events.messageUpdated = require('./events/messageUpdated');

// Export commands for use in other modules
module.exports.commands = commands;

// Init bot
const bot = new Discord.Client();
bot.on('ready', () => {
  console.log('Bot ready!');
});

// Handle messages
bot.on('message', message => {
  if (message.author.bot) { // No bots!

    if (debug) console.log('Ignoring bot message');
    return;

  } else {
    if (debug) console.log('treating ' + message.content + ' from ' + message.author + ' as command.');

    let commandText;

    if (message.content[0] === '!') { // Check for a command via ! prefix
      commandText = message.content.split(' ')[0].substring(1);
    } // else if (message.content.indexOf(bot.user.mention()) == 0) { // Check for a command via bot tag
      // commandText = message.content.split(' ')[1].toLowerCase();
    // }
    else { // no command
      if (debug) console.log('No command.');
      return;
    }

    let command = commands[commandText.toLowerCase()];

    try {
      command.process(bot, message);
    } catch (e) {
      if (debug) console.log('Command ' + commandText + ' failed :(\n' + e.stack);
    }
  }
});

// User joined
bot.on('guildMemberAdd', (guild, member) => {
  events.memberJoined.process(bot, guild, member);
});

// User left
bot.on('guildMemberRemove', (guild, member) => {
  events.memberLeft.process(bot, guild, member);
});

// User update (Added/removed role, changed nickname)
bot.on('guildMemberUpdate', (guild, oldMember, newMember) => {
  // events.memberUpdated.process(bot, guild, oldMember, newMember);
});

// Message deleted
bot.on('messageDelete', (message) => {
  // events.messageDeleted.process(bot, message);
});

// Message edited
bot.on('messageUpdate', (oldMessage, newMessage) => {
  // events.messageUpdated.process(bot, oldMessage, newMessage);
});

// Login
if (debug) {
  console.log('Token: ', token);
  console.log('Start time: ', moment(startTime).format(format));
}

bot.login(token);

const Discord = require('discord.js');
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

// Commands
let commands = {};

// Import commands
commands.avatar = require('./commands/avatar');
commands.help = require('./commands/help');
commands.hug = require('./commands/hug');
commands.joined = require('./commands/joined');
commands.role = require('./commands/role');
commands.set18 = require('./commands/set18');
commands.setregion = require('./commands/setregion');
commands.slap = require('./commands/slap');
commands.spray = require('./commands/spray');
commands.unset18 = require('./commands/unset18');
commands.unsetregion = require('./commands/unsetregion');

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

    if (debug) console.log('No bots!');
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

// Login
if (debug) {
  console.log('Token: ', token);
  console.log('Start time: ', startTime);
}

bot.login(token);

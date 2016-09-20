const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author === bot) return;

    let userLogs = bot.channels.find('name', 'user-logs');

    userLogs.sendMessage(
      '**' + message.author.username +
      '**#' + message.author.discriminator +
      ' deleted a message. ' +
      '(' + moment(Date.now()).format(format) + ')' +
      '```' +
      message.content +
      '```'
    );
  }
};

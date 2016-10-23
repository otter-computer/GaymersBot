const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author.id === bot.user.id) return;

    let userLogs = bot.channels.find('name', 'user-logs');

    userLogs.sendMessage(
      message.author +
      ' deleted a message in ' +
      message.channel + '. ' +
      '(' + moment(Date.now()).format(format) + ')' +
      '```' +
      message.content +
      '```'
    );
  }
};

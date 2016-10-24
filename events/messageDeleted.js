const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author.id === bot.user.id) return;

    // Block Erisbot shite
    if (message.content.startsWith('.music')) return;

    let channel = bot.channels.find('name', 'message-logs');

    channel.sendMessage(
      message.author +
      '\'s message was deleted in ' +
      message.channel + '. ' +
      '(' + moment(Date.now()).format(format) + ')' +
      '```' +
      message.content +
      '```'
    );
  }
};

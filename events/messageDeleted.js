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

    let logMessage = message.author +
    '\'s message was deleted in ' +
    message.channel + '. ' +
    '(' + moment(Date.now()).format(format) + ')\n' +
    '**---**\n' +
    message.content +
    '\n**---**';

    // Attachments
    if (message.attachments) {
      for (let [id, attachment] of message.attachments) {
        console.log(id, attachment.url);
        logMessage += '\n' + attachment.url;
      }
    }

    channel.sendMessage(logMessage);
  }
};

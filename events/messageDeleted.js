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

    let logMessage = 'Message Deleted.\n' +
      'Author: ' + message.author + '\n' +
      'Channel: ' + message.channel + '\n' +
      'Time: ' + moment(Date.now()).format(format) + '\n';

    // Message content
    if (message.content) {
      logMessage += 'Content:\n\n' + message.content;
    }

    // Attachments
    if (message.attachments) {
      if (message.content) {
        logMessage += '\n\n';
      }
      for (let [id, attachment] of message.attachments) {
        logMessage += 'Attachments:\n\n' + attachment.url;
      }
    }

    channel.sendMessage(logMessage);
  }
};

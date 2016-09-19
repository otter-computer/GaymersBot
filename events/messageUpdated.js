const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Welcomes a user to the chat, logs them joining in #user-logs
  process: (bot, oldMessage, newMessage) => {
    let userLogs = bot.channels.find('name', 'user-logs');

    userLogs.sendMessage(
      '**' + newMessage.author.username +
      '**#' + newMessage.author.discriminator +
      ' edited a message. ' +
      '(' + moment(Date.now()).format(format) + ') ' +
      '```' +
      oldMessage.content +
      '```' +
      // 'to' +
      '```' +
      newMessage.content +
      '```'
    );
  }
};

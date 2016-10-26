const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a message edit in #user-logs.
  process: (bot, oldMessage, newMessage) => {
    // Don't tag bot message updates
    if (oldMessage.author === bot || newMessage.author === bot) return;

    let channel = bot.channels.find('name', 'message-logs');

    channel.sendMessage(
      newMessage.author +
      ' edited a message in ' +
      newMessage.channel + '. ' +
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

const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Welcomes a user to the chat, logs them joining in #user-logs
  process: (bot, guild, member) => {
    let general = bot.channels.find('name', 'general');
    let userLogs = bot.channels.find('name', 'user-logs');

    general.sendMessage('Welcome, ' + member + '!');
    userLogs.sendMessage(
      member + ' joined the server. ' +
      '(' + moment(Date.now()).format(format) + ')'
    );

    // TODO: send welcome PM
  }
};

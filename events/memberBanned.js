const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a member being banned in #user-logs
  process: (bot, guild, member) => {
    let userLogs = bot.channels.find('name', 'user-logs');

    userLogs.sendMessage(
      member + ' was banned from the server.' +
      ' (' + moment(Date.now()).format(format) + ')'
    );
  }
};

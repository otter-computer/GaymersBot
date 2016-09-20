const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a member leaving in #user-logs.
  process: (bot, guild, member) => {
    let userLogs = bot.channels.find('name', 'user-logs');

    userLogs.sendMessage(
      member + ' left the server.' +
      ' (' + moment(Date.now()).format(format) + ')'
    );
  }
};

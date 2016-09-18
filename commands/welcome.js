const firebase = require('firebase');

module.exports = {
  // Welcomes a user to the chat, logs them joining in #user-logs
  process: (bot, guild, member) => {
    let general = bot.channels.get('name', 'general');
    let userLogs = bot.channels.get('name', 'user-logs');

    console.log(general);
    console.log(userLogs);
  }
};

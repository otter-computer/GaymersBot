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

    // Welcome PM
    member.sendMessage(
      '__**Welcome to Gaymers!**__\n \n' +
      'Please follow our rules. You can find them in the #info-rules channel. \n \n' +
      'If you have any questions you can @admin or @moderator in any channel or PM an admin or moderator directly \n \n' +
      '__**Useful Commands**__ \n' +
      'These commands can be used in any channel on the server. \n \n' +
      '**!help** - Discobot will PM you a complete list of commands. \n' +
      '**!setregion [region]** - Discobot will set your colour based on your region. For example `!setregion Europe` or `!setregion North America` \n' +
      '**!set18** - Discobot will give you access to the #over-18 channel. \n'
    );
  }
};

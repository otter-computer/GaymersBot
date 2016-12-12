const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a member leaving in #user-logs.
  process: (bot, guild, member) => {
    const userLogs = bot.channels.find('name', 'user-logs');
    const welcomeRoom = bot.channels.find('name', 'welcome-room');

    userLogs.sendMessage(
      member + ' left the server.' +
      ' (' + moment(Date.now()).format(format) + ')'
    );

    // Attempt to find a welcome message for this user in the #welcome-room
    // If one is found within the last 100 messages, delete it. This will also
    // delete any other messages the bot made that mention this user, but
    // that's probably not that big of a concern.
    welcomeRoom.fetchMessages({limit: 100}).then((messages) => {
      messages.forEach((message) => {
        if (message.author.id !== bot.user.id) {
          return;
        }

        const firstMention = message.mentions.users.first();
        if (!firstMention) {
          return;
        }

        if (firstMention.id === member.id) {
          message.delete()
            .catch(console.error);
        }
      })
    },
    (_) => {
      // If this fails, it's no big deal.
    });
  }
};

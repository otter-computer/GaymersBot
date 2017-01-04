const Discord = require('discord.js');

module.exports = {
  // Logs a member leaving in #user-logs.
  process: (bot, guild, member) => {
    const userLogsChannel = bot.channels.find('name', 'user-logs');
    const welcomeRoomChannel = bot.channels.find('name', 'welcome-room');

    let embed = new Discord.RichEmbed();

    embed.setColor(0x607D8B);
    embed.setTitle('User Left');
    embed.addField('User', member);

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

    userLogsChannel.sendMessage('', { embed: embed });

    // Attempt to find a welcome message for this user in the #welcome-room
    // If one is found within the last 100 messages, delete it. This will also
    // delete any other messages the bot made that mention this user, but
    // that's probably not that big of a concern.
    welcomeRoomChannel.fetchMessages({limit: 100}).then((messages) => {
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
      });
    },
    (_) => {
      // If this fails, it's no big deal.
    });
  }
};

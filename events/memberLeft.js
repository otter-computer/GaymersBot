const Discord = require('discord.js');

module.exports = {
  // Logs a member leaving in #user-logs.
  process: (bot, member) => {

    const userLogsChannel = member.guild.channels.find('name', 'user-logs');
    const welcomeRoomChannel = member.guild.channels.find('name', 'welcome-room');

    const embed = new Discord.RichEmbed();

    embed.setColor(0x607D8B);
    embed.setAuthor(
      member.displayName,
      member.avatarURL, '');

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.sendMessage(member + ' left.', { embed: embed });

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
    });
  }
};

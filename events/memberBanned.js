const Discord = require('discord.js');

module.exports = {
  // Logs a member being banned in #user-logs.
  process: (bot, guild, member) => {
    let userLogsChannel = bot.channels.find('name', 'user-logs');

    const embed = new Discord.RichEmbed();

    embed.setColor(0xE74C3C);

    embed.setAuthor(
      member.username,
      member.avatarURL, '');

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.sendMessage(member + ' banned.', { embed: embed });
  }
};

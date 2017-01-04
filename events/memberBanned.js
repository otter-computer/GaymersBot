const Discord = require('discord.js');

module.exports = {
  // Logs a member being banned in #user-logs.
  process: (bot, guild, member) => {
    let userLogsChannel = bot.channels.find('name', 'user-logs');

    let embed = new Discord.RichEmbed();

    embed.setColor(0xE74C3C);
    embed.setTitle('User Banned');
    embed.addField('User', member);

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

    userLogsChannel.sendMessage('', { embed: embed });
  }
};

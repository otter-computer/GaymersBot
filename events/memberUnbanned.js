const Discord = require('discord.js');

module.exports = {
  // Logs a member being unbanned in #user-logs.
  process: (bot, guild, member) => {
    let userLogsChannel = bot.channels.find('name', 'user-logs');

    let embed = new Discord.RichEmbed();

    embed.setColor(0x9B59B6);
    embed.setTitle('User Unbanned');
    embed.addField('User', member);

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

    userLogsChannel.sendMessage('', { embed: embed });
  }
};

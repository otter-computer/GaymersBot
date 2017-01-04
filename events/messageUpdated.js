const Discord = require('discord.js');

module.exports = {
  // Logs a message edit in #user-logs.
  process: (bot, oldMessage, newMessage) => {
    // Don't tag bot message updates
    if (oldMessage.author === bot || newMessage.author === bot) return;

    let messageLogsChannel = bot.channels.find('name', 'message-logs');

    let embed = new Discord.RichEmbed();

    embed.setColor(0xE67E21);
    embed.setTitle('Message Edited');
    embed.addField('User', newMessage.author, true);
    embed.addField('Channel', newMessage.channel, true);

    embed.addField('Old Message', oldMessage.content);
    embed.addField('New Message', newMessage.content);

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

    messageLogsChannel.sendMessage('', { enbed: embed });
  }
};

const Discord = require('discord.js');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author.id === bot.user.id) return;

    // Block Erisbot shite
    if (message.content.startsWith('.music') ||
      message.content.startsWith('.m ')) return;

    let messageLogsChannel = bot.channels.find('name', 'message-logs');

    let embed = new Discord.RichEmbed();

    embed.setColor(0xE74C3C);
    embed.setTitle('Message Deleted');
    embed.addField('User', message.author, true);
    embed.addField('Channel', message.channel, true);
    embed.setTimestamp(message.createdAt);

    // Message content
    if (message.content) {
      embed.addField('Content', message.content);
    }

    // Attachments
    let attachmentArray = message.attachments.array();
    if (attachmentArray.length > 0) {

      // Check the first attachment for an image.
      // If it has a height, set it as the embed image
      let first = message.attachments.first();
      if (first.height) {
        embed.setImage(first.proxyURL);
      }

      // Loop over all, if there's multiple
      if (attachmentArray.length > 1) {
        let attachments;

        for (let [id, attachment] of message.attachments) {
          attachments += attachment.proxyURL + '\n';
        }

        embed.addField('Attachments', attachments);
      }
    }

    messageLogsChannel.sendMessage('', { embed: embed });
  }
};

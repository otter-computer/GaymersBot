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

    const embed = new Discord.RichEmbed();

    embed.setColor(0xE74C3C);
    embed.setAuthor(
      message.guild.member(message.author).displayName,
      message.author.avatarURL, '');
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

    let response = message.author + '\'s message deleted from ' + message.channel + '.';

    messageLogsChannel.sendMessage(response, { embed: embed });
  }
};

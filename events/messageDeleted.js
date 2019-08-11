const Discord = require('discord.js');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author.id === bot.user.id) return;

    const messageLogsChannel = bot.channels.find('name', 'message-logs');

    const embed = new Discord.RichEmbed();

    embed.setColor(0xE74C3C);

    if (message.guild.member(message.author)) {
      // Member is still on the server
      embed.setAuthor(
        message.guild.member(message.author).displayName,
        message.author.avatarURL, '');
    } else {
      // Member left, so fallback to just their username/discriminator
      embed.setAuthor(
        message.author.username + '#' + message.author.discriminator,
        message.author.avatarURL, '');
    }

    embed.setTimestamp(message.createdAt);
    embed.setFooter('Message deleted');

    // Message content
    if (message.content) {
      embed.setDescription(message.content);
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

    messageLogsChannel.send(
      message.author + '\'s message deleted from ' + message.channel + '.',
      { embed: embed }
    );
  }
};

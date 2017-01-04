const Discord = require('discord.js');
const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  // Logs a deleted message in #user-logs.
  process: (bot, message) => {
    // Don't repeat bot messages
    if (message.author.id === bot.user.id ||
      message.author.id === '120897878347481088') return;

    // Block Erisbot shite
    if (message.content.startsWith('.music') ||
      message.content.startsWith('.m ')) return;

    let messageLogsChannel = bot.channels.find('name', 'message-logs');

    let embed = new Discord.RichEmbed();

    embed.setColor(0xE67E21);
    embed.setTitle('Message Deleted');
    embed.addField('User', message.author, true);
    embed.addField('Channel', message.channel, true);
    embed.setTimestamp(message.createdAt);

    // Message content
    if (message.content) {
      embed.addField('Content', message.content);
    }

    // Attachments
    if (message.attachments) {
      // Check the first attachment for an image.
      // If it has a height, set it as the embed image
      if (message.attachments[0].height) {
        embed.setImage(message.attachments[0]);
      }

      // Loop over all, if there's multiple
      if (message.attachments.length > 1) {
        let attachments;

        for (let [id, attachment] of message.attachments) {
          attachments += attachment.url + '\n';
        }

        embed.addField('Attachments', attachments);
      }
    }

    messageLogsChannel.sendMessage('', { embed: embed });
  }
};

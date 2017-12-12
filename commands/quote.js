/* *
 * DiscoBot - Gaymers Discord Bot
 * Copyright (C) 2015 - 2017 DiscoBot Authors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * */

const Discord = require('discord.js');

module.exports = {
  usage: '[messageid]',
  description: 'Display the content of a message in a quoted embed.',
  requireRoles: ['Admin', 'Moderator'],
  allowDM: false,
  process: (bot, message) => {
    let targetMessage = null;

    const args = message.content.split(' ');

    // First index will be the command, ignore it
    args.shift();

    if (args.length !== 1) {
      message.reply('Usage: !quote ' + module.exports.usage);
      return;
    }

    // Since we can't just get a message from the API using its snowflake,
    // we need to ask each channel endpoint if it has our target message.
    //
    // I'm pretty sure this implementation only works if the message is in
    // discord.js's local message cache. We might be able to go a step further
    // and ask discord.js to check message history from the API as well.
    message.guild.channels.forEach((channel) => {
      // Voice channels don't have .messages, just skip them
      if (!channel.messages) {
        return;
      }
      const possibleMessage = channel.messages.get(args[0]);
      if (possibleMessage) {
        targetMessage = possibleMessage;
      }
    });

    if (!targetMessage) {
      message.reply('I can\'t find that message :shrug:');
      return;
    }

    // This embed creation is taken from messageDeleted.js. We may consider
    // centralizing this in some kind of util function since we're using it
    // in multiple places now.
    const embed = new Discord.RichEmbed();
    embed.setColor(0x3398DB);
    // Check that the author is still on the server. If not, fallback to
    // a username/discriminator combo
    if (targetMessage.guild.member(targetMessage.author)) {
      embed.setAuthor(
        targetMessage.guild.member(targetMessage.author).displayName,
        targetMessage.author.avatarURL, '');
    } else {
      embed.setAuthor(
        targetMessage.author.username + '#' +
        targetMessage.author.discriminator,
        targetMessage.author.avatarURL, '');
    }

    embed.setTimestamp(targetMessage.createdAt);
    embed.setFooter('Quote');
    embed.addField('Channel', targetMessage.channel.name);

    if (targetMessage.cleanContent) {
      embed.addField('Message Content', targetMessage.cleanContent);
    }

    // Attachments
    const attachmentArray = targetMessage.attachments.array();
    if (attachmentArray.length > 0) {

      // Check the first attachment for an image.
      // If it has a height, set it as the embed image
      let first = targetMessage.attachments.first();
      if (first.height) {
        embed.setImage(first.proxyURL);
      }

      // Loop over all, if there's multiple
      if (attachmentArray.length > 1) {
        let attachments;

        for (let [id, attachment] of targetMessage.attachments) {
          attachments += attachment.proxyURL + '\n';
        }

        embed.addField('Attachments', attachments);
      }
    }

    message.channel.send({ embed: embed });
  }
};

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

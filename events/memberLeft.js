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
  // Logs a member leaving in #user-logs.
  process: (bot, member) => {

    const userLogsChannel = member.guild.channels.find('name', 'user-logs');
    const welcomeRoomChannel = member.guild.channels.find('name', 'welcome-room');

    const embed = new Discord.RichEmbed();

    embed.setColor(0x607D8B);
    embed.setAuthor(
      member.displayName,
      member.avatarURL, '');

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.sendMessage(member + ' left.', { embed: embed });

    // Attempt to find a welcome message for this user in the #welcome-room
    // If one is found within the last 100 messages, delete it. This will also
    // delete any other messages the bot made that mention this user, but
    // that's probably not that big of a concern.
    welcomeRoomChannel.fetchMessages({limit: 100}).then((messages) => {
      messages.forEach((message) => {
        if (message.author.id !== bot.user.id) {
          return;
        }

        const firstMention = message.mentions.users.first();
        if (!firstMention) {
          return;
        }

        if (firstMention.id === member.id) {
          message.delete()
            .catch(console.error);
        }
      });
    });
  }
};

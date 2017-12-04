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
  process: (bot, member) => {
    const userLogsChannel = member.guild.channels.find('name', 'user-logs');

    // Log the user joining to #user-logs
    const embed = new Discord.RichEmbed();

    embed.setColor(0x2ECC71);

    embed.setAuthor(
      member.displayName,
      member.avatarURL, '');

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.send(member, { embed: embed });

    // DM the user more onboarding information
    member.send(`
      ***Welcome to Gaymers!***
      Thanks for joining us!

      Make sure you read over our rules in the \`#info-rules\` channel. If you have any questions or concerns feel free to ping \`@Admin\` or \`@Moderator\`, or message a staff member directly.

      We have region-based roles that give your name a color. To add one, type \`!setregion North America\` in the \`#bot-room\`.

      We also have game roles to help you find people to play with. To find out what games we have, and how to add one to yourself, type \`!role\` in the \`#bot-room\`.

      To find our other commands, type \`!help\` in the \`#bot-room\`.
    `);
  }
};

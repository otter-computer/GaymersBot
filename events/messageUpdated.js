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
  // Logs a message edit in #user-logs.
  process: (bot, oldMessage, newMessage) => {
    // Don't tag bot message updates
    if (oldMessage.author === bot || newMessage.author === bot) return;

    let messageLogsChannel = bot.channels.find('name', 'message-logs');

    const embed = new Discord.RichEmbed();

    embed.setColor(0xE67E21);
    embed.setTitle('Message Edited');
    embed.addField('User', newMessage.author, true);
    embed.addField('Channel', newMessage.channel, true);

    embed.addField('Old Message', oldMessage.content);
    embed.addField('New Message', newMessage.content);

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);
    embed.setFooter('Message Edited');

    messageLogsChannel.send({ embed: embed });
  }
};

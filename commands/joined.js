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
const moment = require('moment');

module.exports = {
  usage: '[@user]',
  description: 'See when someone joined the server.',
  allowDM: false,
  process: (bot, message) => {
    let target = message.guild.member(message.mentions.users.first());
    if (!target) {
      target = message.member;
    }

    const embed = new Discord.RichEmbed();
    embed.setColor(0x3398DB);

    embed.setTitle(
      target.displayName +
      ' joined ' +
      moment(target.joinedAt).fromNow()
    );

    embed.setAuthor(
      target.displayName,
      target.user.avatarURL,
      ''
    );

    embed.addField('User:', target, true);
    embed.addField('Requested By:', message.author, true);
    embed.addField('Date:', target.joinedAt, true);

    message.channel.send(
      'Here\'s ' +
      target +
      '\'s joined date, requested by ' +
      message.author,
      { embed: embed }
    );
  }
};

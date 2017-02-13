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

// For the special little snowflake...
const REYNBOW = {
  'id': '123395731548536832',
  'joinedAt': '2015-12-27T01:00:00Z'
};

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
    embed.addField('User', target);

    if (target.id === REYNBOW.id) {
      embed.setTitle(target.displayName.toUpperCase() +
        ' BOUNCED IN HERE LIKE A FEISTY \'ROO ABOUT ' +
        moment(REYNBOW.joinedAt).fromNow().toUpperCase() + ', MATE.');
      embed.setTimestamp(REYNBOW.joinedAt);
    } else {
      embed.setTitle(target.displayName + ' joined ' +
        moment(target.joinedAt).fromNow());
      embed.setTimestamp(target.joinedAt);
    }

    message.channel.sendMessage('', { embed: embed });
  }
};

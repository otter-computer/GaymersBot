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
  usage: '[@user]',
  description: 'See someone\'s avatar.',
  allowDM: true,
  process: (bot, message) => {
    if (!message.mentions.users.first() ||
        message.mentions.users.first() === message.author) {
      if (message.author.avatarURL) {

        const embed = new Discord.RichEmbed();
        embed.setColor(0x3398DB);

        embed.setAuthor(
          message.guild.member(message.author).displayName,
          message.author.avatarURL,
          ''
        );

        embed.setImage(
          message.author.avatarURL
        );

        message.channel.send({ embed: embed });
      } else {
        message.reply('You don\'t have an avatar :sob:');
      }
      return;
    }

    const user = message.mentions.users.first();
    if (user.avatarURL) {

      const embed = new Discord.RichEmbed();
      embed.setColor(0x3398DB);

      embed.setAuthor(
        message.guild.member(user).displayName,
        user.avatarURL,
        ''
      );

      embed.setImage(
        user.avatarURL
      );

      embed.addField('User:', user, true);
      embed.addField('Requested By:', message.author, true);

      message.channel.send(
        'Here\'s ' + user + '\'s avatar, requested by ' +
        message.author + ': ',
        { embed: embed }
      );
    } else {
      message.channel.send('Sorry ' + message.author + ', ' + user + ' doesn\'t have an avatar :sob:');
    }
  }
};

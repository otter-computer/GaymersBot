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

module.exports = {
  usage: '[@user]',
  description: 'See someone\'s avatar.',
  allowDM: true,
  process: (bot, message) => {
    if (!message.mentions.users.first() ||
        message.mentions.users.first() === message.author) {
      if (message.author.avatarURL) {
        message.channel.send('Your avatar: ' +
          message.author.avatarURL);
      } else {
        message.reply('You don\'t have an avatar :sob:');
      }
      return;
    }

    const user = message.mentions.users.first();
    if (user.avatarURL) {
      message.channel.send(user + '\'s avatar: ' + user.avatarURL);
    } else {
      message.channel.send(user + ' doesn\'t have an avatar :sob:');
    }
  }
};

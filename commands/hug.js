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
  description: 'Give someone a hug :blush:',
  allowDM: true,
  process: (bot, message) => {

    const hugReplies = [
      '*hugs $USER*',
      '*hugs $USER*',
      '*hugs $USER*',
      '*hugs $USER*',
      '*licks $USER*',
      '*pounces $USER*',
      '*jumps on $USER*',
      '*glomps $USER*',
      '*falls on $USER*',
      '*bear hugs $USER*',
      '*tightly squeezes $USER*',
      '*embraces $USER*',
      '*holds $USER close*',
      '*cuddles $USER*',
      '*takes $USER into his arms*'
    ];

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    message.channel.send(hugReplies[Math.floor(Math.random() * hugReplies.length)].replace('$USER', user));
  }
};

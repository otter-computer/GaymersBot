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

const minecraft = require('./api');
const rcon = require('../rcon');

module.exports = {
  usage: '@DiscordUsername',
  description: 'Provides user information for the Minecraft server.',
  allowDM: false,
  process: (bot, message, args=null) => {

    if (!message.mentions.users.first()) {
      message.reply('I can currently only look up Discord users.');
      return;
    }

    //let targetUsername = args;

    // Call database check for existance of users_minecraft entry

    minecraft.check(message.mentions.users.first(), function(result, data) {
      if (result){
        message.channel.send(message.author + ', Discord user - '+ message.mentions.users.first() + ' is registered as: ' + data[0].minecraft_username);
      }
      else {
        message.channel.send(message.author + ', There is no information regarding Discord user - '+ message.mentions.users.first());
      }
    });

  }
};

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

const readLastLines = require('read-last-lines');

module.exports = {
  usage: '[-n 10]',
  description: 'Gets logs from bot.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  onlyIn: ['rainbow-wrenches'],
  process: (bot, message) => {

    msg = message.content.split(" ");

    if (msg[1] == "-n"){
      if(!msg[2]){
        message.reply('You need to specify a number of lines when using the `-n` flag.');
      }
      else{
        readLastLines.read('logfile.log', msg[2])
        .then((lines) => message.channel.send('```\n' + lines  + '\n ```'));
      }

    }

    else{
      message.channel.send({files:[{attachment:'logfile.log', name: 'logfile.log'}]});
    }

  }
};

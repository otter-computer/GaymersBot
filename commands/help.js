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

const commands = require('./index');
const utils = require('../utils/discordHelpers');

module.exports = {
  usage: '',
  description: 'See what commands I can run!',
  allowDM: true,
  process: (bot, message) => {

    const userCommands = utils.generateCommandSet(false);
    const member = bot.guilds.first().members.get(message.author.id);

    for (let i = 0; i < userCommands.length; i++) {
      message.author.send(userCommands[i]).catch(error => {
        console.error('Couldn\'t send DM' , error);
      });
    }

    if (member.roles.exists('name','Moderator') && !member.roles.exists('name','Admin')) {

      const modCommands = utils.generateCommandSet('Moderator');
      for (let i = 0; i < modCommands.length; i++) {
        message.author.send(modCommands[i]).catch(error => {
          console.error('Couldn\'t send DM' , error);
        });
      }
    }

    if (member.roles.exists('name','Admin')) {
      const adminCommands = utils.generateCommandSet('Admin');
      for (let i = 0; i < adminCommands.length; i++) {
        message.author.send(adminCommands[i]).catch(error => {
          console.error('Couldn\'t send DM' , error);
        });
      }
    }

    // If !help was run in a public channel, send a message to that channel too
    if (message.channel.type === 'text') {
      message.reply('Check your DMs :wink:');
    }
  }
};

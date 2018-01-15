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
  usage: '',
  description: 'Toggles between private and public avatar. Prevents the bot from showing your avatar if it is private.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    if (message.member.roles.findKey('name', 'Private Avatar')) {
      message.member.removeRole(message.member.roles.findKey('name', 'Private Avatar'))
        .then(
          () => {
            message.reply('I have set your avatar to **public** :smile:');
            return;
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    } else {
      message.member.addRole(message.guild.roles.findKey('name', 'Private Avatar'))
        .then(
          () => {
            message.reply('I have set your avatar to **private** :smile:');
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    }
  }
};

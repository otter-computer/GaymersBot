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

const REMINDER_MESSAGE = 'Hi! :smile:\n\n' +
  'This is just a friendly reminder that you have 24 hours to introduce ' +
  'yourself in #welcome-room on the Gaymers Discord server. Once you ' +
  'introduce yourself, you\'ll be given access to the rest of our ' +
  'channels!\n\n' +
  'Some examples of things you can say about yourself are: the games that ' +
  'you play, where you\'re from, and how you heard about us.\n\n' +
  'I hope to see you soon! :heart:\n\n' +
  '(Users that don\'t introduce themselves in 24 hours are automatically ' +
  'kicked. If you introduced yourself but haven\'t gotten staff attention ' +
  'yet, feel free to ping staff with `@Moderator`)';


module.exports = {
  usage: '',
  description: 'Remind users without a role to introduce themselves.',
  allowDM: false,
  requireRoles: ['Admin'],
  process: (bot, message) => {
    let reminderCount = 0;

    message.guild.members.forEach(member => {
      // Every member has the '@everyone' role, if that's *all they have*,
      // then that's who we want to talk to
      if (member.roles.array().length === 1) {
        member.user.sendMessage(REMINDER_MESSAGE);
        reminderCount++;
      }
    });

    message.reply(reminderCount + ' user(s) reminded! :ok_hand:');
  }
};

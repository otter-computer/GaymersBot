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
  description: 'Gives you the 18+ role, allows access to #over-18 ' +
  'and #over-18-text.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    if (message.member.roles.findKey('name', 'Under 18')) {
      message.reply('You\'re under 18. I can\'t add the 18+ role. ' +
          'Check out `!role` to see what I *can* add! :smile:');
      return;
    }

    if (message.member.roles.findKey('name', '18+')) {
      message.reply('You already have 18+ set? :confused:');
      return;
    }

    message.member.addRole(message.guild.roles.findKey('name', '18+'))
      .then(
        () => {
          message.reply('I\'ve set you to 18+ :eggplant::peach: ' +
            'Check out `!role` to see what else you can add!');
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
};

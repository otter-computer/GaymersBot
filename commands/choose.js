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

const splitargs = require('splitargs');

module.exports = {
  usage: '[Option 1] [Option 2] [etc]',
  description: 'Let DiscoBot choose for you.',
  allowDM: true,
  process: (bot, message) => {

    const responses = [
      'I think "%" is the best choice',
      'I\'ve decided on "%"',
      'Definitely "%"',
      '"%" would be best',
      'After much deliberation, "%"',
      'I reckon "%"',
      'I choose "%"'
    ];

    const choices = splitargs(message.content);
    choices.shift();

    if (choices.length === 0) {
      message.reply('Usage: `!choose ' + module.exports.usage + '`');
      return;
    }

    const choice = choices[Math.floor(Math.random() * choices.length)];
    const response = responses[Math.floor(Math.random() * responses.length)].replace('%', choice);
    message.reply(response);
  }
};

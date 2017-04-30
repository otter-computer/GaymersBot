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
  description: 'Lists all available regions for use with the !setregion command.',
  allowDM: true,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    message.reply(
      'To set your region type `!setregion [Your region]` in #bot-room. \n' +
      'Here is the list of available regions: \n```\n' +
      'Europe\n' +
      'North America\n' +
      'South America\n' +
      'Oceania\n' +
      'Africa\n' +
      'Asia\n' +
      'Middle East\n' +
      '```'
    );
  }
};

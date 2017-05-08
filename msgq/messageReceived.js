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

// Message actions
const messageActions = {};

// Import actions
messageActions.default = require('./default');
messageActions.announceStream = require('./announceStream');

module.exports = {
  process: (bot, message) => {
    const guild = bot.guilds.first();

    const args = JSON.parse(message.Body);

    switch (args.action) {
      case 'ANNOUNCE_STREAM':
        messageActions.announceStream.process(bot, args.message);
        break;

      case 'DEFAULT':
        messageActions.default.process(bot, args.message, args.channel);

      default:
        break;
    }
  }
};

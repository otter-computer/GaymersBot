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

const roles = require('../roles');

module.exports = {
  usage: '',
  description: 'List roles that can be added using the !role command.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    const availableRoles = [];

    message.guild.roles.forEach(role => {
      // Exclude restricted roles
      if (roles.RESTRICTED_ROLES.includes(role.name)) {
        return;
      }

      // Exclude region roles
      if (roles.REGION_ROLES.includes(role.name)) {
        return;
      }

      // Exclude @everyone
      if (role.name === '@everyone') {
        return;
      }

      availableRoles.push(role.name);
    });

    message.reply('Here\'s the roles you can add:\n```' +
        availableRoles.join('\n') + '```');
  }
};

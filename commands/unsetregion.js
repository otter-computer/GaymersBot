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
 
const REGION_ROLES = require('../roles').REGION_ROLES;

module.exports = {
  usage: '',
  description: 'Remove your region, remain mysterious.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    // Assemble a list of role IDs to give the removeRoles function, this
    // does all of the removal in one shot.
    const rolesToRemove = [];
    REGION_ROLES.forEach((region) => {
      const roleId = message.guild.roles.findKey('name', region);
      if (roleId) {
        rolesToRemove.push(roleId);
      } else {
        // FIXME: Warn about invalid region in list
      }
    });
    message.member.removeRoles(rolesToRemove)
      .then(
        () => {
          message.reply('I\'ve removed your region :no_entry_sign::map:');
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

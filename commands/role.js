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

/**
 * Tries to case-insensitively find a role matching the input string.
 *
 * @param {any} guild The guild object to look for roles in
 * @param {any} roleName The suspected role name
 * @returns If a valid role, the role object.
 */
function findRole(guild, roleName) {
  for (const role of guild.roles.array()) {
    if (role.name.toLowerCase() === roleName.toLowerCase()) {
      return role;
    }
  }
}

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    let msg = message.content;

    // Some users mis-read the usage text and assume that they need to
    // surround the operator with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split the message into command arguments on spaces
    msg = msg.split(' ');

    // Check that we have at least '!role' and something else (hopefully a 
    // valid operator, but we can also accept commands with no operators, more
    // on that later)
    if (msg.length < 2) {
      message.reply('Usage: `!role ' + module.exports.usage + '`' +
        ' For a list of available roles use `!roles`');
      return;
    }

    // Remove the first element, as it will be '!role'
    msg.shift();

    let operator = msg.shift().toLowerCase();

    // If the user doesn't use add/remove/etc, check to see if they just
    // supplied a role name. If so, toggle that role on them.
    if (operator !== 'add' && operator !== 'set' && operator !== 'remove'
        && operator !== 'unset') {
      // Undo shifting the first element out
      msg.unshift(operator);

      // Attempt to re-interpret the whole thing as a role
      const possibleRole = findRole(message.guild, msg.join(' '));
      if (possibleRole) {
        // This is a role! Do they have it?
        if (message.member.roles.has(possibleRole.id)) {
          // Rewrite their command to be an 'unset'
          operator = 'unset';
        } else {
          // Rewrite their command to be a 'set'
          operator = 'set';
        }
      } else {
        // TODO make a generic usage function
        return;
      }
    }

    // Collapse parameters into a space-delimited string
    let roleName = msg.join(' ').toProperCase();

    // I could use a simple array 'includes' check to see if roleName is within
    // RESTRICTED_ROLES, but that doesn't give me a chance to normalize the
    // contents of RESTRICTED_ROLES. This might waste more CPU time, but it's
    // more reliable than making sure all additions to RESTRICTED_ROLES are
    // normalized correctly.
    const restrictRolesLen = roles.RESTRICTED_ROLES.length;
    for (let i = 0;i < restrictRolesLen;i++) {
      if (roles.RESTRICTED_ROLES[i].toProperCase() === roleName) {
        message.reply('Naughty naughty... :wink: You can\'t ' + operator +
            ' that role!');
        return;
      }
    }

    // Make sure regions aren't touched by this command
    if (roles.REGION_ROLES.includes(roleName)) {
      message.reply('You can change your region using the `!setregion` ' +
          'command! :wink:');
      return;
    }

    const targetRole = message.guild.roles.find('name', roleName);

    // Make sure the role actually exists
    if (!targetRole) {
      message.reply('Sorry... That\'s not a role :sob:');
      return;
    }

    if (operator === 'add' || operator === 'set') {
      // Check if they already have the role
      if (message.member.roles.findKey('id', targetRole.id)) {
        message.reply('You already have that role? :confused:');
        return;
      }

      // Add the new role
      message.member.addRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve added your new role! :ok_hand:');
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    } else if (operator === 'remove' || operator === 'unset') {
      // Check if they have the role in the first place
      if (!message.member.roles.findKey('id', targetRole.id)) {
        message.reply('You don\'t have that role? :confused:');
        return;
      }

      // Remove the role
      message.member.removeRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve removed that role from you! :ok_hand:');
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

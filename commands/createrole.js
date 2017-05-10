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

// Whenever we want to give permissions to roles, this can be uncommented and used for permission names (with permissions.FLAGS)
//const permissions = require('discord.js/src/util/Permissions.js');

// A role group must consist of a single, lowercase word
const roleGroups = {
    'gamerole': {hoist: 'false', permissions: [], mentionable: 'true'}
};

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

function usage(message) {
    message.reply('Usage: `!createrole ' + module.exports.usage + '`\n' +
            'Available role groups:\n```' + Object.keys(roleGroups) + '```\n');
}

module.exports = {
    usage: '[rolegroup] [role]',
    description: 'Create a role with the parameters in rolegroup',
    allowDM: false,
    requireRoles: ['Admin', 'Moderator'],
    process: (bot, message) => {
        let msg = message.content;

        // Some users mis-read the usage text and assume that they need to
        // surround the operator with square brackets. Let's just tolerate their
        // ignorance. (replace '[' or ']' with '')
        msg = msg.replace(/\[|\]/g, '');

        // Split the message into command arguments on spaces
        msg = msg.split(' ');

        // Check that we have at least '!createrole', a role group and a role name
        if (msg.length < 3) {
            usage(message);
            return;
        }

        // Remove the first element, as it will be '!createrole'
        msg.shift();

        let roleGroup = msg.shift().toLowerCase();
        let roleName = msg.join(' ');

        const roleExists = findRole(message.guild, roleName);
        if (roleExists) {
            message.reply('That role exists already!');
            return;
        }

        if (roleGroup in roleGroups) {
            message.guild.createRole({
                name: roleName,
                hoist:roleGroups[roleGroup].hoist,
                permissions:roleGroups[roleGroup].permissions,
                mentionable:roleGroups[roleGroup].mentionable})
              .then(role => {
                  console.log('Created role ' + roleName + ' ' + role);
                  message.reply('Created role ' + roleName);
              })
              .catch(console.error);
        } else {
            message.reply('That role group does not exist!\n');
            usage(message);
            return;
        }
    }
};

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

const REGIONS = require('../roles').REGION_ROLES;

module.exports = {
  usage: '[your region]',
  description: 'Set your region, get pretty color.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    let msg = message.content.split(' ');

    // Remove the first element, as it will be '!setregion'
    msg.shift();

    // Collapse parameters into a space-delimited string
    let regionName = msg.join(' ').toProperCase();

    // Some users mis-read the usage text and assume that they need to
    // surround the name with square brackets. Let's just tolerate their
    // ignorance. :(
    regionName = regionName.replace(/\[|\]/g, '');

    // If the user supplied a bad region name, give them the list
    if (!REGIONS.includes(regionName)) {
      message.reply('To set your region, type `!setregion ' +
          module.exports.usage + '`\nHere\'s the regions I can give you: ' +
          REGIONS.join(', '));
      return;
    }

    const newRegionRole = message.guild.roles.find('name', regionName);
    if (!newRegionRole) {
      // TODO: This means that the bot knows about a region that Discord
      // doesn't. :confused: The bot should call an admin if this happens.
      message.reply('Sorry, I had an issue setting your region. :confounded:');
      return;
    }

    // It's useless to set your region to its current value?
    if (message.member.roles.findKey('name', regionName)) {
      message.reply('You\'ve already set your region to that? :confused:');
      return;
    }

    const oldRegionRole = message.member.roles.find(function(existingRole) {
      return REGIONS.includes(existingRole.name);
    });

    if (oldRegionRole) {
      message.member.removeRole(oldRegionRole)
        .then(member => {
          member.addRole(newRegionRole);
        });
    } else {
      message.member.addRole(newRegionRole);
    }
  }
};

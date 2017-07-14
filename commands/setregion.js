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

const logger = require('../logger').logger;
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

    // Provides aliases for regions, TODO: this should probably be part of the ../roles.js file

    if (regionName.toUpperCase() == 'EU') {
      regionName = 'Europe';
    }
    if (regionName.toUpperCase() == 'NA' || regionName == 'US' || regionName == 'CA' ) {
      regionName = 'North America';
    }
    if (regionName.toUpperCase() == 'SA') {
      regionName = 'South America';
    }
    if (regionName.toUpperCase() == 'OCE' || regionName == 'AU' || regionName == 'NZ') {
      regionName = 'Oceania';
    }
    if (regionName.toUpperCase() == 'AF') {
      regionName = 'Africa';
    }
    if (regionName.toUpperCase() == 'AZ') {
      regionName = 'Asia';
    }
    if (regionName.toUpperCase() == 'ME') {
      regionName = 'Middle East';
    }

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

    // We need to rebuild the role list here because using removeRoles and
    // addRoles shortly after each other seems to not work. It looks like
    // role removal has no effect, even when put in removeRoles' .then()
    // Hopefully I'll be able to debug this in the future and we can return
    // to a simplified .removeRoles() .addRole() solution. JM
    const modifiedRoleList = [];
    message.member.roles.forEach(existingRole => {
      if (REGIONS.includes(existingRole.name)) {
        // Filter out any region roles
        return;
      }
      modifiedRoleList.push(existingRole);
    });
    modifiedRoleList.push(newRegionRole);

    message.member.setRoles(modifiedRoleList)
      .then(
        () => {
          message.reply('I\'ve set your region! :white_check_mark::map: ' +
            'Check out `!role` for other roles you can add!');
        },
        (rejectReason) => {
          // TODO: Reject handler
          logger.error(rejectReason);
        })
      .catch((e) => {
        // TODO: Error handler
        logger.error(e.stack);
      });
  }
};

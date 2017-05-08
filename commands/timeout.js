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

const firebase = require('firebase');
const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  usage: '[@user]',
  description: 'ADMIN ONLY: Give a user the \'Restricted\' role for 30 minutes. Will also remove the \'18+\' role.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message) => {
    let timeoutEnd = Date.now() + 1800000;

    const userLogs = bot.channels.find('name', 'user-logs');

    const restrictedRole = message.guild.roles.find('name', 'Restricted');
    const over18Role = message.guild.roles.find('name', '18+');
    const memberRole = message.guild.roles.find('name', 'Member');

    // Updates to be pushed to firebase
    let updates = {};

    if (!message.mentions.users.first()) {
      message.reply('Usage: !timeout ' + module.exports.usage);
      return;
    }

    for (var [id, user] of message.mentions.users) {

      let member = message.guild.member(user);
      let currentRoles = [];

      // Iterate roles
      for (let [id, currentRole] of member.roles) {

        // Check for 18+ role
        if (currentRole === over18Role) {
          continue;
        }

        // Leave out the Member role since this makes the restriction to
        // #appeals not work.
        if (currentRole === memberRole) {
          continue;
        }

        currentRoles.push(currentRole);
      }

      // Add restricted role
      currentRoles.push(restrictedRole);

      // Reapply the roles!
      member.setRoles(currentRoles);

      // Set timeout release time to now + 30 mins in ms
      updates['/admin/timeout/' + user.id] = timeoutEnd;
    }

    // Push updates to firebase
    firebase.database().ref().update(updates);

    // Confirmation response
    let response = '';

    let mentions = message.mentions.users.array();

    if (mentions.length === 1) {
      response += mentions[0] + ' is';
    } else {
      for (let i = 0; i < mentions.length; i++) {
        response += mentions[i] + ' ';
      }
      response += 'are';
    }

    response += ' on a timeout for 30 minutes.';
    message.reply(response);

    userLogs.send(response + ' (' + moment(Date.now()).format(format) + ') until (' + moment(timeoutEnd).format(format) + ')');
  }
};

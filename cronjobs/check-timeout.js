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
  process: (bot) => {
    const guild = bot.guilds.array()[0];
    const userLogs = guild.channels.find('name', 'user-logs');

    let getData = firebase.database().ref('/admin/timeout/');

    getData.on('value', (snapshot) => {
      if (snapshot.val()) {
        let data = snapshot.val();

        let updates = {};

        for (let user in data) {
          let member = guild.member(user);
          let expires = data[user];

          // If timeout has expired
          if (expires < Date.now() && member) {
            let currentRoles = [];
            let restrictedRole = guild.roles.find('name', 'Restricted');

            // Iterate roles
            for (let [id, currentRole] of member.roles) {

              // Check for Restricted roles
              if (currentRole === restrictedRole) {
                continue;
              }

              currentRoles.push(currentRole);
            }

            // Reapply the roles!
            member.setRoles(currentRoles);

            // Remove from firebase
            updates['/admin/timeout/' + user] = null;

            // Log removal in user-logs
            userLogs.sendMessage(member + ' has been removed from timeout. (' + moment(Date.now()).format(format) + ')');
          }
        }

        // Push updates to firebase
        firebase.database().ref().update(updates);
      }
    });
  }
};

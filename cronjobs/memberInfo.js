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

const https = require('https');

function postData(users) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/userdata',
    method: 'POST',
    headers: {
      'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY
    }
  };

  const request = https.request(options);

  request.write(JSON.stringify(users));
  request.end();
}

module.exports = {
  process: (bot) => {
    console.log('Running memberInfo cron');
    const guild = bot.guilds.first();
    const members = guild.members;

    let updates = [];

    for (let [id, member] of members) {
      updates.push({
        userid: id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatar,
        member: member.roles.exists('name', 'Member') ? 1 : 0
      });
    }

    postData(updates);
  }
};

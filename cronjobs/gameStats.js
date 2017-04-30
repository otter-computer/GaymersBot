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

// Shite filter
const filter = [
  'mee6bot.com',
  'with your daddy',
  'Google Chrome',
  'Spotify',
  'with Time',
  'with a Blackstar',
  'http://discservs.co',
  'look at me!',
  'Half-Life 4',
  'dead',
  'Sukin Dik🍆😛',
  'Unity',
  'LondonGaymers.com',
  'Russian Roulette',
  'Internet',
  'kickin\' it in the Void',
  'At VapeNation™',
  'AFK Simulator 2k17',
  'with my nose',
  'PornoViewer 3501™',
  'Im doing better',
  'on her computer',
  'Is This A Zombie?',
  'with my Mommy UWU',
  'The Moon Song',
  'searcing tha web',
  'Creation Kit',
  'With Himself',
  'W/ LIFE'
];

function postData(gameData) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/stats',
    method: 'POST'
  };

  const request = https.request(options);

  request.write(JSON.stringify(gameData));
  request.end();
}

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.first();
    const users = guild.presences;

    let updates = [];

    UserLoop:
    for (let [id, presence] of users) {
      if (presence.game) {
        for (let i = 0; i < filter.length; i++) {
          if (presence.game.name === filter[i]) {
            continue UserLoop;
          }
        }

        updates.push({
          user: id,
          game: presence.game.name
        });
      }
    }

    postData(updates);
  }
};

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
const splitargs = require('splitargs');

module.exports = {
  usage: '',
  description: 'List upcoming server events.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message) => {

    const args = splitargs(message.content);

    const options = {
      host: 'events.gaymers.gg',
      path: '/survey',
      method: 'GET'
    };

    const request = https.get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (data){
          var jData = JSON.parse(data);
          console.log(jData);
          if (args[1] && args[1] == 'results') {
            message.channel.send('Survey Link: ' + jData.surveyurl + '\n Survey Data: ' + jData.surveydata);
          }
          else {
           message.channel.send('Survey Link: ' + jData.surveyurl);
          }
        }
        else {
          message.channel.send('Sorry, no surveys are scheduled right now.');
        }
      });
    });

    request.end();
  }
};

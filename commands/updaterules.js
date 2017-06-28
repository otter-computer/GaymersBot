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

const appConfig = require('../index').appConfig;
const https = require('https');

module.exports = {
  usage: '',
  description: 'updates the rules in #info-rules.',
  allowDM: false,
  requireRoles: ['Admin'],
  process: (bot, message) => {

    const options = {
      host: 'api.github.com',
      path: '/repos/gaymers-discord/administration/contents/server_rules.md',
      method: 'GET',
      headers: { "Content-Type": "application/json", 
                 "User-Agent": "administration", 
                 "Authorization": "token " + appConfig.GITHUB_ACCESS_TOKEN}
    };

    const request = https.get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        let jData = JSON.parse(data);
        let decoded = Buffer.from(jData.content, 'base64');

        // Delete the original messages
        let rulesChannel = bot.channels.find('name', 'info-rules');
        rulesChannel.fetchMessages({limit: 20}).then(
          messages => rulesChannel.bulkDelete(messages)
        ).catch(console.error);

        // Split output message on markdown line breaks
        let msgArray = decoded.toString().split('---');
        console.log(msgArray.length);
        msgArray.forEach(function(element) {
          let output = '```markdown\n' +  element + '\n```';
          rulesChannel.send(output);
        });

      });
    });

    request.end();

    
  }
};

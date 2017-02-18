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

const Discord = require('discord.js');
const request = require('request');

module.exports = {
  usage: '',
  description: 'List upcoming server events.',
  allowDM: false,
  process: (bot, message) => {
    request('https://api.gaymers.gg/events', (error, response, body) => {
      if (!error && response.statusCode == 200) {
        buildEmbeds(JSON.parse(body), message);
      }

      if (error || response.statusCode != 200) {
        console.log('Error', error);
        // TODO: Reply with error :'(
      }
    });
  }
};

function buildEmbeds(events, message) {
  message.reply('Here\'s the upcoming events:');

  for (let event of events) {
    const embed = new Discord.RichEmbed();

    embed.setTitle(event.title);
    embed.setDescription(event.description);
    embed.setTimestamp(event.start);
    embed.setURL('https://gaymers.gg/events');

    if (event.image) {
      embed.setImage(event.image);
    }

    embed.addField(
      'Sign up for this event:',
      '!event join ' + event.id,
      true
    );

    message.channel.sendEmbed(embed);
  }
}

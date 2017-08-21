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
const Discord = require('discord.js');
const https = require('https');

module.exports = {
  usage: '',
  description: 'List upcoming server events.',
  allowDM: false,
  process: (bot, message) => {

    let eventFiles = [];

    let options = {
      host: 'api.github.com',
      path: '/repos/gaymers-discord/gaymers-website/contents/src/pages',
      method: 'GET',
      headers: { "Content-Type": "application/json",
                 "User-Agent": "administration",
                 "Authorization": "token " + appConfig.GITHUB_ACCESS_TOKEN}
    };

    // Pull all the event files in the event folder
    const mainRequest = https.get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        let jData = JSON.parse(data);

        for ( var index in jData ) {
          if ( jData[index].type == 'file' ) {
            eventFiles.push(jData[index].name);
          }
        }

        console.log(eventFiles);
        console.log('^^^^^ file listing ^^^^^');

        doSubRequest(eventFiles, function(eventObj){
          console.log(eventObj);
          console.log('^^^^^ data listing ^^^^^');
          //loop over eventObj and build embeds
          //buildEmbeds(JSON.parse(data), message);
        });
      });
    });

    mainRequest.end();
  }
};

function doSubRequest(eventFiles, callback){
  // Recurse through each filename to get the contents
  let events = {};

  eventFiles.forEach(function(element) {

    let options = {
      host: 'api.github.com',
      path: '/repos/gaymers-discord/gaymers-website/contents/src/pages/' + element,
      method: 'GET',
      headers: { "Content-Type": "application/json",
                 "User-Agent": "administration",
                 "Authorization": "token " + appConfig.GITHUB_ACCESS_TOKEN}
    };

    const subRequest = https.get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        let jData = JSON.parse(data);
        //console.log(jData);


        let event = {};
        event.name = jData.name.split('.')[0];
        event.content = Buffer.from(jData.content, 'base64').toString();
        console.log(event);
        events[element] = event;

        callback(events);
        //buildEmbeds(JSON.parse(data), message);
      });
    });

    subRequest.end();
  });
}

function buildEmbeds(events, message) {
  let embeds = [];

  if (events.length < 1) {
    noEvents(message);
    return;
  }

  for (let event of events) {
    if (Date.parse(event.start) < Date.now()) {
      continue;
    }

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

    embeds.push(embed);
  }

  if (embeds.length < 1) {
    noEvents(message);
    return;
  }

  message.reply('Here\'s the upcoming events:');

  for (let embed of embeds) {
    message.channel.send({embed: embed});
  }
}

function noEvents(message) {
  message.reply('Sorry, no events are scheduled right now. Check back later!');
}

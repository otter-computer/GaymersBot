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

const splitargs = require('splitargs');
const https = require('https');

module.exports = {
  usage: '[join/leave] [event ID]',
  description: 'Sign up to a server event!',
  allowDM: false,
  process: (bot, message) => {
    const args = splitargs(message.content);

    if (!args[1] || !args[2]) {
      errorHandler(message);
      return;
    }

    let modifier;

    if (args[1]) {
      modifier = args[1].toLowerCase();
    }

    if (modifier === 'join') {
      joinEvent(message, args[2]);
    }

    if (modifier === 'leave') {
      leaveEvent(message, args[2]);
    }

    if (modifier === 'join' && modifier === 'leave') {
      errorHandler(message);
    }
  }

};

function sendRequest(eventId, userId, modifier, callback, message) {
  let urlModifer;

  if (modifier) {
    urlModifer = '/botjoin';
  } else {
    urlModifer = '/botleave';
  }

  const options = {
    host: 'api.gaymers.gg',
    path: '/events/' + eventId + urlModifer,
    method: 'POST',
    headers: {
      'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY
    }
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const parsedData = JSON.parse(data);

      let error;

      if (parsedData.errorMessage || parsedData.affectedRows == 0) {
        error = true;
      } else {
        error = false;
      }

      callback(modifier, error, message);
    });
  });

  request.on('error', (e) => {
    // console.log('Error', e);
  });

  request.write(JSON.stringify({ userid: userId }));
  request.end();
}

function joinEvent(message, eventId) {
  sendRequest(eventId, message.author.id, true, callback, message);
}

function leaveEvent(message, eventId) {
  sendRequest(eventId, message.author.id, false, callback, message);
}

function errorHandler(message) {
  message.reply(
    'Sorry, I didn\'t understand. :sob: ' +
    'Try using the command like this:\n' +
    '`!event [join/leave] [Event ID]`'
  );
}

function callback(modifier, error, message) {
  if(modifier) {
    if (!error) {
      message.reply('I\'ve added you to the event. See you there :smile:');
    } else {
      message.reply('You\'ve already signed up to the event. See you there :smile:');
    }
  } else {
    if (!error) {
      message.reply('I\'ve removed you to the event. Sorry to see you go :frowning:');
    } else {
      message.reply('You\'ve not signed up to that event.');
    }
  }
}

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

// Minecraft API Spec available at https://github.com/gaymers-discord/server-rcon

exports.mc_whitelist = function(username, action, callback) {

  let commandData = 'whitelist ';

  switch (action)
  {
    case "add":
      commandData = commandData + 'add ' + username;
      break;
    case "remove":
      commandData = commandData + 'remove ' + username;
      break;
    default:
      callback('invalid action');
      break;
  }

  const options = {
    host: 'rcon.gaymers.gg',
    path: '/minecraft',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
      if (jData.errorMessage){
        callback(false);
      }
      else {
        callback(true);
      }

    });
  });

  request.write(JSON.stringify({ command: commandData }));
  request.end();

};

exports.mc_command = function(username, action, callback) {

  let commandData = '';

  switch (action)
  {
    case "kick":
      commandData = commandData + 'kick ' + username;
      break;
    case "ban":
      commandData = commandData + 'ban ' + username;
      break;
    case "unban":
    case "pardon":
      commandData = commandData + 'pardon ' + username;
      break;
    default:
      callback(false,'invalid action');
      break;
  }

  const options = {
    host: 'rcon.gaymers.gg',
    path: '/minecraft',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
      if (jData.errorMessage){
        callback(false, "The server is offline.");
      }
      else {
        callback(true);
      }

    });
  });

  request.write(JSON.stringify({ command: commandData }));
  request.end();

};

exports.mcChat = function(message, callback) {

  let commandData = 'say ';

  if (!message) {
    return;
  }

  let user = message.author;

  commandData += '<' + user.username + '>: ' + message.content;

  const options = {
    host: 'rcon.gaymers.gg',
    path: '/minecraft',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
      if(jData.errorMessage){
        callback(true);
      }
      callback();

    });
    response.on('error', (err) => {
      console.log(err);
    });
  });

  request.write(JSON.stringify({ command: commandData }));
  request.end();

};

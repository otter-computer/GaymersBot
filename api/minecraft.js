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

// Minecraft API Spec available at https://github.com/gaymers-discord/gaymers-minecraft-api

exports.check = function(member, callback) {

  let userid = member.id;

  const options = {
    host: 'minecraftadmin.gaymers.gg',
    path: '/'+userid,
    method: 'GET',
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
      if (jData.length == 1){
        callback(true);
      }
      else {
        callback(false);
      }

    });
  });

  request.write(JSON.stringify({}));
  request.end();

};

exports.register = function(member, targetUsername, callback) {

  let userid = member.id;

  const options = {
    host: 'minecraftadmin.gaymers.gg',
    path: '/'+userid,
    method: 'PUT',
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
      if (jData.affectedRows == 1){
        callback(true);
      }
      else{
        callback(false);
      }

    });
  });

  request.write(JSON.stringify({ username: targetUsername }));
  request.end();

};


exports.deregister = function(member, callback) {

  let userid = member.id;

  const options = {
    host: 'minecraftadmin.gaymers.gg',
    path: '/'+userid,
    method: 'DELETE',
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
      if (jData.affectedRows == 1){
        callback(true);
      }
      else{
        callback(false);
      }

    });
  });

  request.write(JSON.stringify({}));
  request.end();

};

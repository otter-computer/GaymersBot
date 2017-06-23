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

function updatePresence(member) {

let userid = member.user.id;
let userdata = member;

let memberflag = 0
let under18flag = 0;

  if (member.roles.findKey('name', 'Under 18')) {
    under18flag = 1;
  }

  if (member.roles.findKey('name', 'Member')) {
    memberflag = 1;
  }

  let roles = {
    under18: under18flag,
    member: memberflag
  };

  const options = {
    host: 'users.gaymers.gg',
    path: '/'+userid+'/update',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY,}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
    });
  });

  request.write(JSON.stringify({ userinfo: userdata, roleinfo: roles }));
  request.end();

}


function updateRole(member) {

let userid = member.user.id;
let userdata = member;
let memberflag = 0
let under18flag = 0;

  if (member.roles.findKey('name', 'Under 18')) {
    under18flag = 1;
  }

  if (member.roles.findKey('name', 'Member')) {
    memberflag = 1;
  }

  let roles = {
    under18: under18flag,
    member: memberflag
  };

  const options = {
    host: 'users.gaymers.gg',
    path: '/'+userid+'/update',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY,}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
    });
  });

  request.write(JSON.stringify({ userinfo: userdata, roleinfo: roles }));
  request.end();

}

function updateLeaver(member) {

let userid = member.user.id;

  const options = {
    host: 'users.gaymers.gg',
    path: '/'+userid+'/leave',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY,}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
    });
  });

  request.write(JSON.stringify({}));
  request.end();

}

function updateJoiner(member) {

let userid = member.user.id;
let userdata = member;

  const options = {
    host: 'users.gaymers.gg',
    path: '/'+userid+'/join',
    method: 'POST',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY,}
  };

  const request = https.request(options, (response) => {

    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let jData = JSON.parse(data);
    });
  });

  request.write(JSON.stringify({ userinfo: userdata }));
  request.end();

}

module.exports = {
  process: (action, bot, oldMember, newMember) => {

    // Update from presence change
    if (action == 'presence'){
      updatePresence(newMember); 
    }
    // Update from role/nickname
    else if (action == 'update') {
      updateRole(newMember); 
    }

    else if (action == 'leave') {
      updateLeaver(oldMember); 
    }

    else if (action == 'join') {
      updateJoiner(oldMember); 
    }
  }
};

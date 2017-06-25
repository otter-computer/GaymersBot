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

const minecraft = require('../api/minecraft');
const rcon = require('../api/rcon');

module.exports = {
  usage: '[username]',
  description: 'Whitelists a user for the Minecraft server.',
  allowDM: false,
  process: (bot, message) => {

    let msg = message.content;

    msg = msg.split(' ');

    if (msg.length != 2) {
      message.reply('Usage: !minecraft_register ' + module.exports.usage);
      return;
    }

    msg.shift();

    let targetUsername = msg[0];

    // Call database check for existance of users_minecraft entry

    minecraft.check(message.author, function(result) {
      if (result){
        message.channel.send(message.author + ', You are already registered with the minecraft server, if you wish to change your registration please use `!minecraft_deregister` first :ok_hand:');
      }
      else{
        // Fire register to database module
        minecraft.register(message.author, targetUsername, function(result){
          if (result) {
            // Fire RCON module
            rcon.mc_whitelist(targetUsername, 'add', function(cmdResult) {
              if (cmdResult) {
                message.channel.send(message.author + ', You have been whitelisted to our minecraft server, look forward to seeing you at `minecraft.gaymers.gg` :ok_hand:');
              }
              else {
                minecraft.deregister(message.author, function(result){
                  message.channel.send(message.author + ', Sorry there was an issue processing your registration :cry:. The server is offline.');
                });
              }
            });
          }
          else {
            message.channel.send(message.author + ', Sorry there was an issue processing your registration :cry:');
          }

        });

      }
    });

  }
};

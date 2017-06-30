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

const minecraft = require('./api');
const rcon = require('../rcon');

module.exports = {
  usage: '@DiscordUsername',
  description: 'kick/ban a user.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message, args=null) => {

    let msg = message.content;
    msg = msg.split(' ');
    let action = msg[3];

    if (msg.length < 4) {
      message.reply('This command is not valid.');
      return;
    }

    if (!message.mentions.users.first()) {
      message.reply('I can currently only look up Discord users.');
      return;
    }

    // Call database check for existance of users_minecraft entry
    minecraft.check(message.mentions.users.first(), function(result, data) {
      // If the discord user was found in the database, proceed with rcon actions
      if (result){
        // Get the username from the database callback
        let targetUsername = data[0].minecraft_username;

        // Run the rcon kick/ban/unban action
        rcon.mc_command(targetUsername, action, function(cmdResult, data) {
          // If the command was executed on the server, continue
          if (cmdResult) {
              if (action == 'ban'){
                // Banning suggests removal from the whitelist
                rcon.mc_whitelist(targetUsername, 'remove', function() {
                  message.channel.send(message.mentions.users.first() + ' was banned.');
                });
              }
              else if (action == 'unban'||action == 'pardon'){
                // Unbanning results in readding the user to the whitelist
                rcon.mc_whitelist(targetUsername, 'add', function() {
                  message.channel.send(message.mentions.users.first() + ' was unbanned.');
                });
              }
              else if (action == 'kick') {
                // Kicking does not result in whitelist interaction
                message.channel.send(message.mentions.users.first() + ' was kicked.');
              }
          }
          // If the rcon execution failed - server is offline or an invalid action was requested
          else {
            message.channel.send(message.author +
              ', Sorry there was an issue processing your command :cry:. ' + data);
          }
        });
      }
      // If the discord user was not registered with the minecraft database
      else{
        message.channel.send(message.mentions.users.first() +
          ' is not registered with the minecraft server.');
      }
    });
  }
};

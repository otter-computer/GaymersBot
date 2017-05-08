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

module.exports = {
  process: (bot, message) => {
    const targetGuild = process.env.TARGET_GUILD;
    const guildObj = bot.guilds.find('name', targetGuild);

    const args = JSON.parse(message.Body);

    if (args.channel &&  args.message){

      if (args.action == "NOTIFY"){
        const notificationChannel = guildObj.channels.find('name', args.channel);

        if (!notificationChannel) {
          console.error('Channel #'+args.channel+' doesn\'t exist!');
        } else {
          notificationChannel.sendMessage(args.message);
        }
      }

      
    }
    


  }
};

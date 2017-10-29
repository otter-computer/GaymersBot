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

const logger = require('../logger').logger;
const Discord = require('discord.js');
const https = require('https');
const appConfig = require('../index').appConfig;

function checkUserExists(member,callback){

  let userid = member.user.id;

  const options = {
    host: 'users.gaymers.gg',
    path: '/'+userid+'',
    method: 'GET',
    headers: { "Content-Type": "application/json",
               'x-api-key': appConfig.APIGW_DISCOBOT_X_API_KEY,}
  };

  const request = https.get(options, (response) => {

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

  request.end();

}

module.exports = {
  process: (bot, member) => {
    const userLogsChannel = member.guild.channels.find('name', 'user-logs');
    const welcomeChannel = member.guild.channels.find('name', 'welcome-room');

    checkUserExists(member, function(existance){

      let userReturnMsg = '';
      let modReturnMsg = ' joined.';

      if (existance){
        userReturnMsg = 'back ';
        modReturnMsg = ' returned.';
      }

      // Log the user joining to #user-logs
      if (!userLogsChannel) {
        logger.error('Channel #user-logs doesn\'t exist!');
      } else {
        const embed = new Discord.RichEmbed();

        embed.setColor(0x3398DB);

        embed.setAuthor(
          member.displayName,
          member.avatarURL, '');

        const embedDate = new Date(Date.now()).toISOString();
        embed.setTimestamp(embedDate);

        userLogsChannel.send(member + modReturnMsg, { embed: embed });
      }

      // Add a little message to #welcome-room to grab the user's attention
      if (!welcomeChannel) {
        logger.error('Channel #welcome-room doesn\'t exist!');
      } else {

        welcomeChannel.send('Welcome '+userReturnMsg+'to Gaymers, ' + member + '! ' +
            'Please introduce yourself, and check your DMs for more info! ' +
            'You will have access to other channels once you introduce ' +
            'yourself. :smile:\n\n' +
            'Feel free to tag a Moderator using `@Moderator` once you have ' +
            'introduced yourself if they are taking too long to respond. :smile:') ;
      }

      // DM the user more onboarding information
      member.send(
        '__**Welcome '+userReturnMsg+'to Gaymers!**__\n\n' +
        'Please introduce yourself in **#welcome-room**, and feel free to ' +
        'tell us about your favorite games, where you\'re from, how you heard ' +
        'about the server, and anything else about yourself you\'d like to ' +
        'share.\n\n' +
        'We have region-based tags to help you find local gaming friends, and ' +
        'some special tags for members who like Overwatch, Battlefield, ' +
        'League of Legends and more. We are happy to add them to your ' +
        'profile so you have an easier time finding folks to play with!\n\n' +
        'You will be given access to the other channels after you introduce ' +
        'yourself.'
      );
    });
  }
};

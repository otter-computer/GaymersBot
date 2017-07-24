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

function usernameUpdate(bot, oldMember, newMember) {
  const userLogsChannel = bot.channels.find('name', 'user-logs');

  // Create the embed
  const embed = new Discord.RichEmbed();
  embed.setColor(0xF1C40E);
  embed.addField('User', newMember);

  const embedDate = new Date(Date.now()).toISOString();
  embed.setTimestamp(embedDate);

  // User changed account username
  if (oldMember.user.username !== newMember.user.username) {
    embed.setTitle('User Changed Account Username');

    embed.addField('Old Username', oldMember.user.username, true);
    embed.addField('New Username', newMember.user.username, true);
  }

  // User adds a nickname
  if (!oldMember.nickname && newMember.nickname) {
    embed.setTitle('User Added Nickname');

    embed.addField('New Nickname', newMember.nickname, true);
  }

  // User removes a nickname
  if (oldMember.nickname && !newMember.nickname) {
    embed.setTitle('User Removed Nickname');

    embed.addField('Old Nickname', oldMember.nickname, true);
  }

  if (oldMember.nickname && newMember.nickname &&
    oldMember.nickname != newMember.nickname) {
    embed.setTitle('User Changed Nickname');

    embed.addField('Old Nickname', oldMember.nickname, true);
    embed.addField('New Nickname', newMember.nickname, true);
  }

  userLogsChannel.send('', { embed: embed });
}



function memberRestricted(member) {
  // Remove the 'Member' role if someone gains the 'Restricted' role.
  // This is needed because in Discord an 'ALLOW' permission takes precedence
  // over a 'DENY' permission, which results in the 'ALLOW's from 'Member'
  // keeping 'Restricted' from working.
  const memberRole = member.guild.roles.find('name', 'Member');
  const eighteenRole = member.guild.roles.find('name', '18+');
  member.removeRoles([memberRole, eighteenRole])
    .then(
      () => { },
      reason => {
        // TODO Rejection handler
        logger.error(reason);
      }
    )
    .catch(e => {
      // TODO Error handler
      logger.error(e);
    });

  // If the member is in a voice chat, move them to AFK
  if (member.voiceChannel) {
    let afkVoiceChannel = member.guild.afkChannelID;

    if (!afkVoiceChannel) {
      // If there's no AFK channel defined by the server owner, look for a
      // channel named 'AFK'
      logger.error('There is no server AFK channel, searching for a ' +
        'channel named AFK...');
      afkVoiceChannel = member.guild.channels.filter(value => {
        return value.type === 'voice' && value.name.toUpperCase() === 'AFK';
      }).first();

      if (!afkVoiceChannel) {
        // There's neither server-defined AFK channel nor a channel named
        // 'AFK'?! Fall back to a mute.
        member.setMute(true);
        logger.error('There is neither a server AFK channel nor a channel ' +
          'named AFK.');
        // TODO Error handler
        return;
      }
    }

    member.setVoiceChannel(afkVoiceChannel);
  }
}



function memberRoleAdded(newMember) {
  const generalChannel = newMember.guild.channels.find('name', 'general');
  const userLogsChannel = newMember.guild.channels.find('name', 'user-logs');

  // Publicly welcome the user
  if (!generalChannel) {
    logger.error('Channel #general doesn\'t exist!');
  } else {
    generalChannel.send('Welcome, ' + newMember + '!');
  }

  // Log the user becoming a member to #user-logs
  if (!userLogsChannel) {
    logger.error('Channel #user-logs doesn\'t exist!');
  } else {

    const embed = new Discord.RichEmbed();

    embed.setColor(0x2ECC71);
    embed.setAuthor(
        newMember.displayName,
        newMember.avatarURL, '');

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.send(newMember + ' granted membership.', { embed: embed });
  }

  // DM the user with our welcome message
  newMember.send(
    '__**Welcome to Gaymers!**__\n \n' +
    'Please follow our rules. You can find them in the #info-rules channel. \n \n' +
    'If you have any questions you can @admin or @moderator in any channel or PM an admin or moderator directly \n \n' +
    '__**Useful Commands**__ \n' +
    'These commands can be used in the #bot-room channel on Gaymers. \n \n' +
    '**!help** - Discobot will PM you a complete list of commands. \n' +
    '**!setregion [region]** - Discobot will set your colour based on your region. For example `!setregion Europe` or `!setregion North America` \n' +
    '**!set18** - Discobot will give you access to the #over-18 channel. \n'
  );
}



module.exports = {
  process: (bot, oldMember, newMember) => {

    // Nickname change
    if (oldMember.nickname !== newMember.nickname ||
      oldMember.user.username !== newMember.user.username) {
      usernameUpdate(bot, oldMember, newMember);
    }

    // User gained the 'Restricted' role
    if (!oldMember.roles.findKey('name', 'Restricted') &&
      newMember.roles.findKey('name', 'Restricted')) {
      memberRestricted(newMember);
    }

    // User became a member
    if (!oldMember.roles.findKey('name', 'Member') &&
      newMember.roles.findKey('name', 'Member')) {
      memberRoleAdded(newMember);
    }
  }
};

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
  process: (bot, member) => {
    const userLogsChannel = member.guild.channels.find('name', 'user-logs');
    const generalChannel = member.guild.channels.find('name', 'general');

    // Log the user joining to #user-logs
    if (!userLogsChannel) {
      console.error('Channel #user-logs doesn\'t exist!');
    } else {
      const embed = new Discord.RichEmbed();

      embed.setColor(0x2ECC71);

      embed.setAuthor(
        member.displayName,
        member.avatarURL, '');

      const embedDate = new Date(Date.now()).toISOString();
      embed.setTimestamp(embedDate);

      userLogsChannel.send(member + ' joined.', { embed: embed });
    }

    generalChannel.send('Welcome, ' + member + '!');

    // DM the user more onboarding information
    member.send(
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
};

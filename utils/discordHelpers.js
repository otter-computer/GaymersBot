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

const commands = require('../commands/index');
const roles = require('../roles');
const utils = this;

exports.commandValidInChannel = function(command, message) {
/*
 * Return `true` if the command is allowed in this channel, `false` if not.
 * Will DM the user and delete the message if not.
 *
 * @param command
 * @param message
 * @returns {boolean}
 */

  if (command.onlyIn.includes(message.channel.name)) {
    return true;
  }

  // Complain to the user about their mistake
  const validChannels = [];
  command.onlyIn.forEach(channelName => {
    const channel = message.guild.channels.find('name', channelName);
    // If that channel doesn't exist on this server, leave it out
    if (!channel) {
      return;
    }

    // If the user can't read messages in that channel, leave it out
    if (!channel.permissionsFor(message.member).has('READ_MESSAGES')) {
      return;
    }

    validChannels.push('`' + channelName + '`');
  });

  if (validChannels.length === 0) {
    message.member.send(
      'Sorry, that command can\'t be used in ' +
      'that channel.'
    ).catch(error => {
      console.error('Couldn\'t send DM' , error);
    });
  } else if (validChannels.length === 1) {
    message.member.send(
      'Sorry, that command can only be used ' +
      'in ' + validChannels[0] + '.'
    ).catch(error => {
      console.error('Couldn\'t send DM' , error);
    });
  } else {
    message.member.send(
      'Sorry, that command can only be used in ' +
      'the following channels: ' + validChannels.join(', ') + '.'
    ).catch(error => {
      console.error('Couldn\'t send DM' , error);
    });
  }

  // Remove the problem message
  message.delete()
    .catch(reason => {
      // TODO Error handler
      console.error(reason);
    });

  return false;
};

exports.generateCommandSet = function(role) {

  let title = role ? role : 'Available';
  title += ' Commands';
  let commandString = '```markdown' + '\n';

  commandString +=  title + '\n';
  commandString +=  Array(title.length + 1).join('=') + '\n';
  let commandArray = [];

  // TODO: Display commands based on requireRoles
  for (let command in commands) {
    let cmd = commands[command];
    let info = '!' + command;

    // Skip commands that require roles based on parameter
    if (cmd.requireRoles && !role){
      // Drops user commands
      continue;
    }
    if (!cmd.requireRoles && role){
      // Drops non role commands when generating role list
      continue;
    }

    if (cmd.requireRoles && role){
      if (!cmd.requireRoles.includes(role)){
        // Drops commands not requiring the role parameter
        continue;
      }
    }

    if (cmd.usage) {
      info += ' ' + cmd.usage;
    }

    if (cmd.description) {
      info += ' - ' + cmd.description;
    }

    if ((commandString.length + info.length) < 1900) {
      commandString += info + '\n';
    } else {
      commandString += '```';
      commandArray.push(commandString);
      commandString = '```'; // Reset
      commandString += info + '\n';
    }
  }
  commandString += '```';
  commandArray.push(commandString);

  return commandArray;
};

exports.messageHandler = function(bot, message) {

  // Ignore bot messages
  if (message.author.bot) {
    return;
  }

  // Commands start with '!'
  if (message.content[0] !== '!') {
    return;
  }

  const commandText = message.content.split(' ')[0].substring(1).toLowerCase();
  const command = commands[commandText];

  // Check that the command exists
  if (!command) {
    return;
  }

  // If a command isn't allowed in a DM (or doesn't have allowDM defined),
  // make sure we're in a guild.
  if (!command.allowDM && !message.guild) {
    message.reply('Sorry, I can only do that on a server. :frowning2:');
    return;
  }

  // Checks that are only needed on a server
  if (message.guild) {
    // Check that the user is allowed to use the bot
    let shouldIgnoreMessage = true;

    // Check that the bot has any required roles at all
    if (roles.REQUIRED_TO_USE_BOT.length > 0) {
      // Try to find a common role between the required list and the
      // user's roles
      roles.REQUIRED_TO_USE_BOT.forEach((requiredRole) => {
        if (message.member.roles.findKey('name', requiredRole)) {
          shouldIgnoreMessage = false;
        }
      });
    } else {
      shouldIgnoreMessage = false;
    }

    // Check that the user is not part of a role that is banned from bot usage
    roles.BANNED_FROM_BOT.forEach((bannedRole) => {
      if (message.member.roles.findKey('name', bannedRole)) {
        shouldIgnoreMessage = true;
      }
    });

    if (shouldIgnoreMessage) {
      return;
    }

    // If the command can only be used in certain channels, check that we're in
    // one of those channels
    if (command.onlyIn && command.onlyIn.length > 0) {
      if (!utils.commandValidInChannel(command, message)) {
        return;
      }
    }
  }

  // If the command requires roles, check that the user has one of them
  if (command.requireRoles) {
    // A command can't require roles and support DMs.
    // This is a programmer error.
    if (!message.guild) {
      // TODO: Programmer error
      return;
    }

    let satisfiesRoles = false;

    // Loop through the roles needed by the command and see if the user
    // has any of them.
    command.requireRoles.forEach((role) => {
      if (message.member.roles.findKey('name', role)) {
        satisfiesRoles = true;
      }
    });

    if (!satisfiesRoles) {
      message.channel.send('I\'m sorry ' + message.author + ', I\'m ' +
        'afraid I can\'t do that.');
      return;
    }
  }

  command.process(bot, message);
};

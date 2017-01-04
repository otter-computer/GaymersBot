const moment = require('moment');
const format = require('../momentFormat');

function usernameUpdate(bot, oldMember, newMember) {
  let channel = bot.channels.find('name', 'user-logs');

  let oldMemberName, newMemberName;

  if (!oldMember.nickname) {
    oldMemberName = '**' + oldMember.user.username + '**#' + oldMember.user.discriminator;
  } else {
    oldMemberName = '**' + oldMember.nickname + '**#' + oldMember.user.discriminator;
  }

  if (!newMember.nickname) {
    newMemberName = '**' + newMember.user.username + '**#' + newMember.user.discriminator;
  } else {
    newMemberName = '**' + newMember.nickname + '**#' + newMember.user.discriminator;
  }

  channel.sendMessage(
    oldMemberName + ' is now ' + newMemberName + ' ' +
    '(' + moment(Date.now()).format(format) + ')'
  );
}

function memberRestricted(member) {
  // Remove the 'Member' role if someone gains the 'Restricted' role.
  // This is needed because in Discord an 'ALLOW' permission takes precedence
  // over a 'DENY' permission, which results in the 'ALLOW's from 'Member'
  // keeping 'Restricted' from working.
  const memberRole = member.guild.roles.find('name', 'Member');
  member.removeRole(memberRole)
    .then(
        () => {},
        reason => {
          // TODO Rejection handler
          console.error(reason);
        }
    )
    .catch(e => {
      // TODO Error handler
      console.error(e);
    });
}

function memberRoleAdded(newMember) {
  const generalChannel = newMember.guild.channels.find('name', 'general');
  const userLogsChannel = newMember.guild.channels.find('name', 'user-logs');

  // Publicly welcome the user
  if (!generalChannel) {
    console.error('Channel #general doesn\'t exist!');
  } else {
    generalChannel.sendMessage('Welcome, ' + newMember + '!');
  }

  // Log the user becoming a member to #user-logs
  if (!userLogsChannel) {
    console.error('Channel #user-logs doesn\'t exist!');
  } else {
    userLogsChannel.sendMessage(
      newMember + ' was granted membership. ' +
      '(' + moment(Date.now()).format(format) + ')'
    );
  }

  // DM the user with our welcome message
  newMember.sendMessage(
    '__**Welcome to Gaymers!**__\n \n' +
    'Please follow our rules. You can find them in the #info-rules channel. \n \n' +
    'If you have any questions you can @admin or @moderator in any channel or PM an admin or moderator directly \n \n' +
    '__**Useful Commands**__ \n' +
    'These commands can be used in any channel on the server. \n \n' +
    '**!help** - Discobot will PM you a complete list of commands. \n' +
    '**!setregion [region]** - Discobot will set your colour based on your region. For example `!setregion Europe` or `!setregion North America` \n' +
    '**!set18** - Discobot will give you access to the #over-18 channel. \n'
  );
}

module.exports = {
  process: (bot, oldMember, newMember) => {
    // Nickname change
    //if (oldMember.nickname !== newMember.nickname) {
    //  usernameUpdate(bot, oldMember, newMember);
    //}

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

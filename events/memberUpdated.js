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

  userLogsChannel.sendMessage('', { embed: embed });
}



function memberRestricted(member) {
  // Remove the 'Member' role if someone gains the 'Restricted' role.
  // This is needed because in Discord an 'ALLOW' permission takes precedence
  // over a 'DENY' permission, which results in the 'ALLOW's from 'Member'
  // keeping 'Restricted' from working.
  const memberRole = member.guild.roles.find('name', 'Member');
  member.removeRole(memberRole)
    .then(
      () => { },
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

    const embed = new Discord.RichEmbed();

    embed.setColor(0x2ECC71);
    embed.setTitle('User Granted Membership');
    embed.addField('User', newMember);

    const embedDate = new Date(Date.now()).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.sendMessage('', { embed: embed });
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

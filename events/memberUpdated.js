const Discord = require('discord.js');

function usernameUpdate(bot, oldMember, newMember) {
  let userLogsChannel = bot.channels.find('name', 'user-logs');

  let oldMemberName, newMemberName;

  if (!oldMember.nickname) {
    oldMemberName = oldMember.user.username;
  } else {
    oldMemberName = oldMember.nickname;
  }

  if (!newMember.nickname) {
    newMemberName = newMember.user.username;
  } else {
    newMemberName = newMember.nickname;
  }

  let embed = new Discord.RichEmbed();

  embed.setColor(0xF1C40E);
  embed.setTitle('User Changed Nickname');
  embed.addField('User', newMember);
  embed.addField('Old Name', oldMemberName, true);
  embed.addField('New Name', newMemberName, true);

  let embedDate = new Date(Date.now());
  embed.setTimestamp(embedDate.toISOString());

  userLogsChannel.sendMessage('', { embed: embed });
}

function memberRoleAdded(guild, newMember) {
  const generalChannel = guild.channels.find('name', 'general');
  const userLogsChannel = guild.channels.find('name', 'user-logs');

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

    let embed = new Discord.RichEmbed();

    embed.setColor(0x2ECC71);
    embed.setTitle('User Granted Membership');
    embed.addField('User', newMember);

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

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

    // User became a member
    if (!oldMember.roles.findKey('name', 'Member') &&
          newMember.roles.findKey('name', 'Member')) {
      memberRoleAdded(newMember.guild, newMember);
    }
  }
};

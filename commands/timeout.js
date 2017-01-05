const Discord = require('discord.js');
const firebase = require('firebase');
const splitargs = require('splitargs');
const juration = require('juration');

module.exports = {
  usage: '[@user] [30m]',
  description: 'ADMIN ONLY: Give a user the \'Restricted\' role for 30 minutes. Will also remove the \'18+\' role.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message) => {
    const userLogsChannel = bot.channels.find('name', 'user-logs');

    const restrictedRole = message.guild.roles.find('name', 'Restricted');
    const over18Role = message.guild.roles.find('name', '18+');
    const memberRole = message.guild.roles.find('name', 'Member');

    // Calculate the end time
    const timeoutStart = Date.now();

    // Let's grab just the time...
    let timeoutLengthArray = splitargs(message.content);
    timeoutLengthArray.shift();
    timeoutLengthArray.shift();
    let timeoutLength = timeoutLengthArray[0];

    if (!timeoutLength) timeoutLength = '30m';

    const timeoutEnd = timeoutStart + juration.parse(timeoutLength) * 1000;

    // Updates to be pushed to firebase
    let updates = {};

    if (!message.mentions.users.first()) {
      message.reply('Usage: !timeout ' + module.exports.usage);
      return;
    }

    let user = message.guild.member(message.mentions.users.first());
    let currentRoles = [];

    // Iterate roles to remove 18+ and Member
    for (let [id, currentRole] of user.roles) {

      // Check for 18+ role
      if (currentRole === over18Role) {
        continue;
      }

      // Leave out the Member role since this makes the restriction to
      // #appeals not work.
      if (currentRole === memberRole) {
        continue;
      }

      currentRoles.push(currentRole);
    }

    // Add restricted role
    currentRoles.push(restrictedRole);

    // Reapply the roles!
    user.setRoles(currentRoles);

    // Set timeout release time to now + 30 mins in ms
    updates['/admin/timeout/' + user.id] = timeoutEnd;

    // Push updates to firebase
    firebase.database().ref().update(updates);

    // Send a confirmation message to #user-logs
    let embed = new Discord.RichEmbed();

    embed.setColor(0xE67E21);
    embed.setTitle('User Given Timeout');
    embed.addField('User', user, true);
    embed.addField('Timeout Length',
      juration.stringify(juration.parse(timeoutLength)), true);

    embed.setFooter('Timeout End');

    let embedDate = new Date(timeoutEnd);
    embed.setTimestamp(embedDate.toISOString());

    userLogsChannel.sendMessage('', { embed: embed });
  }
};

const Discord = require('discord.js');
const AWS = require('aws-sdk');
const splitargs = require('splitargs');
const Duration = require('duration-js');

module.exports = {
  usage: '[@user] [30m]',
  description: 'ADMIN ONLY: Give a user the \'Restricted\' role  (default: 30 minutes). Will also remove the \'18+\' and \'Member\' role.',
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
    const timeoutLengthArray = splitargs(message.content);
    timeoutLengthArray.shift();
    timeoutLengthArray.shift();
    let timeoutLength;

    if (!timeoutLengthArray[0]) {
      timeoutLength = new Duration('30m');
    } else {
      try {
        timeoutLength = new Duration(timeoutLengthArray[0]);
      } catch (error) {
        timeoutLength = new Duration('30m');
      }
    }

    const timeoutEnd = timeoutStart + timeoutLength;

    if (!message.mentions.users.first()) {
      message.reply('Usage: !timeout ' + module.exports.usage);
      return;
    }

    const user = message.guild.member(message.mentions.users.first());
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

    // AWS DynamoDB connection
    const dbClient = new AWS.DynamoDB.DocumentClient();

    // Updates to be pushed to AWS DynamoDB
    const updates = {
      TableName: 'discobot',

      Item: {
        'id': user.id,
        'timeoutStart': timeoutStart,
        'timeoutEnd': timeoutEnd
      }
    };

    // Push updates to AWS DynamoDB
    dbClient.put(updates, (error, data) => {
      if (error) {
        console.log('Error adding data', JSON.stringify(error, null, 2));
      }
    });

    // Send a confirmation message to #user-logs
    const embed = new Discord.RichEmbed();

    embed.setColor(0xE67E21);
    embed.setTitle('User Given Timeout');
    embed.addField('User', user, true);
    embed.addField('Timeout Length', timeoutLength.toString(), true);

    embed.setFooter('Timeout End');

    const embedDate = new Date(timeoutEnd).toISOString();
    embed.setTimestamp(embedDate);

    userLogsChannel.sendMessage('', { embed: embed });
  }
};

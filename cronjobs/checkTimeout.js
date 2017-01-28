const Discord = require('discord.js');
const AWS = require('aws-sdk');

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.array()[0];
    const userLogsChannel = guild.channels.find('name', 'user-logs');

    // AWS DynamoDB connection
    const dbClient = new AWS.DynamoDB.DocumentClient();

    // Scan table for all data
    const params = {
      TableName: 'discobot'
    };

    dbClient.scan(params, (error, data) => {
      if (error) {
        console.log('Error scanning table', JSON.stringify(error, null, 2));
      } else {

        for (let user in data.Items) {
          let member = guild.member(data.Items[user].id);
          let expires = data.Items[user].timeoutEnd;

          // If timeout has expired
          if (expires < Date.now() && member) {
            let currentRoles = [];
            const restrictedRole = guild.roles.find('name', 'Restricted');
            const memberRole = guild.roles.find('name', 'Member');

            // Iterate roles
            for (let [id, currentRole] of member.roles) {

              // Check for Restricted roles
              if (currentRole === restrictedRole) {
                continue;
              }

              currentRoles.push(currentRole);
            }

            // Give them back the member role
            currentRoles.push(memberRole);

            // Reapply the roles!
            member.setRoles(currentRoles);

            let updates = {
              TableName: 'discobot',

              Key: {
                'id': data.Items[user].id
              }
            };

            // Delete record from AWS DynamoDB
            dbClient.delete(updates, (error, data) => {
              if (error) {
                console.log('Error deleting item', JSON.stringify(error, null, 2));
              } else {
                console.log('Delete successful', JSON.stringify(data, null, 2));
              }
            });

            // Log removal in user-logs
            const embed = new Discord.RichEmbed();

            embed.setColor(0xE67E21);
            embed.addField('User', member, true);

            const embedDate = new Date(Date.now()).toISOString();
            embed.setTimestamp(embedDate);

            const response = member + 'removed from timeout';

            userLogsChannel.sendMessage(response, { embed: embed });
          }
        }
      }
    });
  }
};

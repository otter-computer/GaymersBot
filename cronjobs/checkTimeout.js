const Discord = require('discord.js');
const firebase = require('firebase');

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.array()[0];
    const userLogsChannel = guild.channels.find('name', 'user-logs');

    let getData = firebase.database().ref('/admin/timeout/');

    getData.on('value', (snapshot) => {
      if (snapshot.val()) {
        let data = snapshot.val();

        let updates = {};

        for (let user in data) {
          let member = guild.member(user);
          let expires = data[user];

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

            // Remove from firebase
            updates['/admin/timeout/' + user] = null;

            // Log removal in user-logs
            const embed = new Discord.RichEmbed();

            embed.setColor(0xE67E21);
            embed.setTitle('User Removed From Timeout');
            embed.addField('User', member, true);

            const embedDate = new Date(Date.now()).toISOString();
            embed.setTimestamp(embedDate);

            userLogsChannel.sendMessage('', { embed: embed });
          }
        }

        // Push updates to firebase
        firebase.database().ref().update(updates);
      }
    });
  }
};

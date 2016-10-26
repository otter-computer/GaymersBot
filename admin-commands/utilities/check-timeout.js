const firebase = require('firebase');
const moment = require('moment');
const format = require('../../momentFormat');

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.array()[0];
    const userLogs = guild.channels.find('name', 'user-logs');

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
            let restrictedRole = guild.roles.find('name', 'Restricted');

            // Iterate roles
            for (let [id, currentRole] of member.roles) {

              // Check for Restricted roles
              if (currentRole === restrictedRole) {
                continue;
              }

              currentRoles.push(currentRole);
            }

            // Reapply the roles!
            member.setRoles(currentRoles);

            // Remove from firebase
            updates['/admin/timeout/' + user] = null;

            // Log removal in user-logs
            userLogs.sendMessage(member + ' has been removed from timeout. (' + moment(Date.now()).format(format) + ')');
          }
        }

        // Push updates to firebase
        firebase.database().ref().update(updates);
      }
    });
  }
};

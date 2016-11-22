const roles = require('../roles');

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself.',
  process: (bot, message) => {
    // Error check so not in PM
    if (message.channel.type !== 'text') {
      message.reply('sorry... I can\'t set roles inside private messages.');
      return;
    }

    let msg = message.content;

    // Some users mis-read the usage text and assume that they need to
    // surround the operator with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split the message into command arguments on spaces
    msg = msg.split(' ');

    let toggle = msg[1].replace('[','').replace(']','').toLowerCase();

    // Check for operator, add or remove
    if (toggle !== 'add' && toggle !== 'set' && toggle !== 'remove' && toggle !== 'unset') {
      message.reply('sorry... I don\'t understand what you want me to do with that role :sob:');
      return;
    }

    let roleName = '';

    // Concat roles with spaces
    for (let i = 2; i < msg.length; i++) {
      if (roleName.length > 1) roleName += ' ';

      roleName += msg[i].replace('[','').replace(']','').toProperCase();
    }

    // I could use a simple array 'includes' check to see if roleName is within
    // RESTRICTED_ROLES, but that doesn't give me a chance to normalize the
    // contents of RESTRICTED_ROLES. This might waste more CPU time, but it's
    // more reliable than making sure all additions to RESTRICTED_ROLES are
    // normalized correctly.
    const restrictRolesLen = roles.RESTRICTED_ROLES.length;
    for (let i = 0;i < restrictRolesLen;i++) {
      if (roles.RESTRICTED_ROLES[i].toProperCase() === roleName) {
        if (toggle === 'add' || toggle === 'set') {
          message.reply('naughty naughty... :wink: You can\'t ' + toggle +
              ' the ' + roleName + ' role to yourself.');
        } else {
          message.reply('sorry... I can\'t ' + toggle + ' the role ' +
              roleName + ' from you :frowning:');
        }
        return;
      }
    }

    // Check if role exists
    if (message.guild.roles.find('name', roleName)) {
      let role = message.guild.roles.find('name', roleName);
      let member = message.guild.member(message.author);
      let currentRoles = [];

      for (var [id, currentRole] of member.roles) {

        // If role we're adding/removing is equal to the current iterated role
        if (currentRole === role) {
          // If adding, check if role already set on member
          if (toggle === 'add' || toggle === 'set') {
            message.reply('you already have the ' + role.name + ' role.');
            return;
          }
        } else {
          currentRoles.push(currentRole);
        }
      }

      // If adding, add the new role into the array
      if (toggle === 'add' || toggle === 'set') {
        currentRoles.push(role);
      }

      // Reapply the roles!
      member.setRoles(currentRoles);

      // Add role
      if (toggle === 'add' || toggle === 'set') {
        message.reply('I\'ve given you the ' + roleName + ' role. :smile:');
        return;
      } else { // Remove role
        message.reply('I\'ve removed you from the ' + roleName + ' role. :smile:');
        return;
      }
    } else { // Role doesn't exist
      message.reply('sorry... There isn\'t a role called ' + roleName + ' :sob:');
      return;
    }
  }
};

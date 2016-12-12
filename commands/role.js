const roles = require('../roles');

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself.',
  allowDM: false,
  process: (bot, message) => {
    let msg = message.content;

    // Some users mis-read the usage text and assume that they need to
    // surround the operator with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split the message into command arguments on spaces
    msg = msg.split(' ');

    // Remove the first element, as it will be '!role'
    msg.shift();

    let operator = msg.shift().toLowerCase();

    // Check that operator is a valid option
    if (operator !== 'add' && operator !== 'set' && operator !== 'remove'
        && operator !== 'unset') {
      message.reply('Sorry... I don\'t understand what you want me to do ' +
          'with that role :sob:');
      return;
    }

    // Collapse parameters into a space-delimited string
    let roleName = msg.join(' ').toProperCase();

    // I could use a simple array 'includes' check to see if roleName is within
    // RESTRICTED_ROLES, but that doesn't give me a chance to normalize the
    // contents of RESTRICTED_ROLES. This might waste more CPU time, but it's
    // more reliable than making sure all additions to RESTRICTED_ROLES are
    // normalized correctly.
    const restrictRolesLen = roles.RESTRICTED_ROLES.length;
    for (let i = 0;i < restrictRolesLen;i++) {
      if (roles.RESTRICTED_ROLES[i].toProperCase() === roleName) {
        message.reply('Naughty naughty... :wink: You can\'t ' + operator +
            ' that role!');
        return;
      }
    }

    // Make sure regions aren't touched by this command
    if (roles.REGION_ROLES.includes(roleName)) {
      message.reply('You can change your region using the `!setregion` ' +
          'command! :wink:');
      return;
    }

    // Make sure the role actually exists
    if (!message.guild.roles.find('name', roleName)) {
      message.reply('Sorry... That\'s not a role :sob:');
      return;
    }

    const targetRole = message.guild.roles.find('name', roleName);
    const member = message.guild.member(message.author);
    const newRoles = [];

    // TODO: If we're removing a role and the user doesn't have the role, let
    // them know that what they're doing doesn't make sense.

    // Rebuild the user's role list into newRoles
    for (let [id, role] of member.roles) {
      if (targetRole === role) {
        if (operator === 'add' || operator === 'set') {
          message.reply('You already have the ' + role.name +
              ' role? :confounded:');
          return;
        } else {
          // We're removing this role, and we'll just leave it out
        }
      } else {
        newRoles.push(role);
      }
    }

    // If adding a new role, add it on to the new roles list
    if (operator === 'add' || operator === 'set') {
      newRoles.push(targetRole);
    }

    // ...and apply!
    member.setRoles(newRoles);

    // Give the user the appropriate feedback message
    if (operator === 'add' || operator === 'set') {
      message.reply('I\'ve added your new role! :ok_hand:');
    } else {
      message.reply('I\'ve removed that role from you! :ok_hand:');
    }
  }
};

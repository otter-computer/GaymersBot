const roles = require('../roles');

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    let msg = message.content;

    // Some users mis-read the usage text and assume that they need to
    // surround the operator with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split the message into command arguments on spaces
    msg = msg.split(' ');

    // Check that we have at least '!role' 'add|remove|(etc)' and a role
    if (msg.length < 3) {
      message.reply('Usage: `!role ' + module.exports.usage + '`' +
        ' For a list of available roles use `!roles`');
      return;
    }

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

    const targetRole = message.guild.roles.find('name', roleName);

    // Make sure the role actually exists
    if (!targetRole) {
      message.reply('Sorry... That\'s not a role :sob:');
      return;
    }

    if (operator === 'add' || operator === 'set') {
      // Check if they already have the role
      if (message.member.roles.findKey('id', targetRole.id)) {
        message.reply('You already have that role? :confused:');
        return;
      }

      // Add the new role
      message.member.addRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve added your new role! :ok_hand:');
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    } else if (operator === 'remove' || operator === 'unset') {
      // Check if they have the role in the first place
      if (!message.member.roles.findKey('id', targetRole.id)) {
        message.reply('You don\'t have that role? :confused:');
        return;
      }

      // Remove the role
      message.member.removeRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve removed that role from you! :ok_hand:');
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    }
  }
};
